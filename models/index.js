/*jshint node:true */

"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var truncate = require('truncate');
var env = process.env.NODE_ENV || "development";
// var config = require(__dirname + '/../config/db.json')[env];
var config = require(__dirname + '/../config/db.json')["aws"];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

var Gcm = require('../gcm/test');


fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
    var model = sequelize.import (path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


db.UsersKeywords.belongsTo(db.Keywords, {foreignKey: 'keyword_id'});

// 키워드의 user_id 로 Users 정보 가져오기
db.UsersKeywords.belongsTo(db.Users, {foreignKey: 'user_id', targetKey: 'user_id'});

db.Posts.hasMany(db.UsersLikePosts, {foreignKey:'post_id'});
db.UsersLikePosts.belongsTo(db.Posts, {foreignKey: 'post_id'});


db.UsersLikePosts.belongsTo(db.Users, {foreignKey: 'user_id', targetKey: 'user_id'});


db.Posts.hook('afterCreate', function(post, options){
	console.log('index.js Posts afterCreate ');
	var gcm = new Gcm();

	var post_title = post.get('post_title');
	var post_content = truncate (post.get('post_content') , 20);

	findKeywords(post_title, function(err, keywords){
		if (err) {
			throw err;
		} else {
			db.UsersKeywords.findAll({
				where : {'keyword_id' : keywords},
				include : [
					{
						model : db.Users,
						attributes: ['reg_id']
					}
				]
			}).then(function(users){
				var reg_ids = users.filter(function(item){
					console.log('item', item.User.get('reg_id'));
					if ( item.User.get('reg_id') ) return true;
					else return false;
				}).map(function(item) {return item.User.get('reg_id'); });

				gcm.sendGcm('post_title', 'post_content', reg_ids, function(result){
					console.log('result : ', result);
				});
			});
		}
	});

});

function findKeywords(sentence, callback) {
	db.Keywords.findAll({
		limit : 50,
		order  : 'updated_at DESC',
		attributes: ['id', 'keyword']
	}).then(function(result){
		var keywords = result.filter(function(item){
			var include = sentence.indexOf(item.keyword);
			if( include > -1 ) return true;
			else return false;
		}).map(function(item) { return item.id;} );
		callback(false, keywords);
	}).catch(function(err){
		callback(true, err);
	});
}

// findKeywords('[졸업] 17년 동계방학 MOS자격증 특강반 모집 안내', function(err, keywords){
// 	if (err) {
// 		throw err;
// 	} else {
// 		db.UsersKeywords.findAll({
// 			where : {'keyword_id' : keywords},
// 			include : [
// 				{
// 					model : db.Users,
// 					attributes: ['reg_id']
// 				}
// 			]
// 		}).then(function(users){
// 			var reg_ids = users.filter(function(item){
// 				console.log('item', item.User.get('reg_id'));
// 				if ( item.User.get('reg_id') ) return true;
// 				else return false;
// 				// return item;
// 			}).map(function(item) {return item.User.get('reg_id'); });
// 		});
// 	}
// });



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


// db.Keywords.options.defaultScope = {
//     order: 'count DESC'
// };
//
// db.UsersKeywords.options.defaultScope = {
//     include: [
//         {
//             model: db.Keywords
//         }
//     ]
// };
