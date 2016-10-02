'use strict';

var userScore = require('../../app/controllers/userScore.server.controller'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
	app.route('/api/userScores')
		.get(userScore.list)
		.post(users.requiresLogin, userScore.create);

	app.route('/api/userScores/:userId')
		.put(userScore.update);

	app.route('/api/userScores/:userScoreId')
		.delete(userScore.delete);

	app.param('userId', userScore.userScoreByUserId);
	app.param('userScoreId', userScore.userScoreById);
};