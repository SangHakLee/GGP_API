var fs = require('fs');
module.exports = function(sequelize, DataTypes) {
    var Keywords = sequelize.define('Keywords', {
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        tableName: 'KEYWORDS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {
			afterCreate : function(keyword, options){

				var path = __dirname + '/../templates/email.html';

				var _keyword = keyword.get('keyword');
				var created_at = keyword.get('created_at');
				created_at = moment(created_at).format('YYYY 년 MM 월 DD 일 hh:mm');

				send({
					to: to,
				},{
					keyword: _keyword,
					created_at: created_at
				},
				function(err, info){
					if(err){
				       console.log('Error', err);
				   }else{
				       console.log('Password reset sent');
				   }
			   });
			}
		},
        defaultScope: {
            order: 'count DESC'
        }
    });
    return Keywords;
};



var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var moment = require('moment');
var config = require(__dirname + '/../config/mail.json');
// var to = 'code.ryan.lee@gmail.com, ngcmw9101@gmail.com, prhkhk61@gmail.com';
var to = 'code.ryan.lee@gmail.com';
var smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: config.auth
}));

// 	"SMTP", {
// 	service: 'Gmail',
// 	auth: config.auth
// });

var mailOptions = {
	from: '아마따 <gachon10.bridge@gmail.com>',
	to: to,
	subject: '키워드 등록 안내',
};
var path = __dirname + '/../templates/email.html';
var html =  fs.readFileSync(path, 'utf8');

var send = smtpTransport.templateSender({
	from: '아마따 <gachon10.bridge@gmail.com>',
	subject: '키워드 등록 안내',
	html: html
});
