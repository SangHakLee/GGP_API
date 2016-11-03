module.exports = function(sequelize, DataTypes) {
    var Posts = sequelize.define('Posts', {
        post_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        board_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        board_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        post_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        post_content_html: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        posted_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'POSTS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {
			afterCreate: function(post, options) {

				// FIXME
				var DETAIL_URL = 'http://gachon.ac.kr/community/opencampus/03.jsp?mode=view&boardType_seq=358&board_no=';
				var post_title = post.get('post_title');
				var board_no   = post.get('board_no');
				var link = DETAIL_URL + board_no;
				send({
					to: to,
				},{
					post_title: post_title,
					link: link
				},
				function(err, info){
					if(err){
						logger.error(err);
				   }else{
				       logger.info('공지사항 등록 후 이메일 완료');
				   }
			   });
			}
		}
    });
    return Posts;
};

var logger = require('../logger/winston');
var fs = require("fs");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require(__dirname + '/../config/mail.json');
var to = 'code.ryan.lee@gmail.com, ngcmw9101@gmail.com, prhkhk61@gmail.com';
var smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: config.auth
}));


var path = __dirname + '/../templates/post.html';
var html =  fs.readFileSync(path, 'utf8');

var send = smtpTransport.templateSender({
	from: '아마따 <gachon10.bridge@gmail.com>',
	subject: '공지사항 등록 안내',
	html: html
});
