var models = require('../models');

function Bot() {}

Bot.prototype.findKeywords = function(sentence) {
	return models.Keywords.findAll({
		limit : 50,
		order : ['updated_at', 'desc']
	}).then(function(keywords){
		return keywords;
	}).catch(function(err){
		throw err;
	});
};

module.exports = Bot;
