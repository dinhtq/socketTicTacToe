'use strict';

var mongoose = require('mongoose'),
	UserScore = mongoose.model('UserScore');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};


exports.list = function (req, res) {
	UserScore.find().populate('user').exec(function(err, userScores) {
		if (err) {
			res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(userScores);
		}
	});
};


exports.create = function (req, res) {
	console.log('create userScore');
	// create new userScore object
	var userScore = new UserScore(req.userScore);
	// assign the userScore user
	userScore.user = req.user;
	// save 
	userScore.save(function(err){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		res.json(userScore);
	});
};

exports.update = function (req, res) {
	console.log('update');

	if (req.userScore === undefined || req.userScore === null) {
		// create userScore
		// create new userScore object
		var userScore = new UserScore();
		// assign the userScore user
		userScore.user = req.user;
		// save 
		userScore.save(function(err){
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}

			res.json(userScore);
		});
	} else {
		// get userScore
		var userScore = req.userScore;

		// update score
		userScore.score = userScore.score + 1;

		// save
		userScore.save(function(err){
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}

			res.json(userScore);
		});
	}


};

exports.delete = function (req, res) {
	console.log('delete');
	// get userScore
	var userScore = req.userScore;

	// remove
	userScore.remove(function(err){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}

		res.json(userScore);
	});
};

exports.userScoreByUserId = function (req, res, next, userId) {
	console.log('userScoreByUserId');
	console.log(userId);
	UserScore.findOne({ 'user': userId }).populate('user').exec(function(err, userScore){
		if (err) return next(err);
		if (!userScore) {
			console.log('Cannot find userScore by userId: ' + userId);
		} else {
			console.log('Found userScore by userId: ' + userId);
		};

		req.userScore = userScore;

		next();
	});
};


exports.userScoreById = function (req, res, next, userScoreId) {
	console.log('userScoreById');
	console.log(userScoreId);
	UserScore.findById(userScoreId).exec(function(err, userScore){
		if (err) return next(err);
		if (!userScore) return next(new Error('Failed to load userScore by id: ' + userScoreId));

		req.userScore = userScore;

		next();
	});
};











