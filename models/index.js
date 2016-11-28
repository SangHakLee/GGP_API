/*jshint node:true */

"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
// var config = require(__dirname + '/../config/db.json')[env];
var config = require(__dirname + '/../config/db.json')["aws"];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

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

db.Posts.hasMany(db.UsersLikePosts, {foreignKey:'post_id'});
db.UsersLikePosts.belongsTo(db.Posts, {foreignKey: 'post_id'});


db.UsersLikePosts.belongsTo(db.Users, {foreignKey: 'user_id', targetKey: 'user_id'});


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
