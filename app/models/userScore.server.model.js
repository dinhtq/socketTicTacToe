'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserScoreSchema = new Schema({
	score: {
		type: Number,
		default: 1
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('UserScore', UserScoreSchema);