/* eslint-disable no-useless-escape */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema({
	nickname: {
		type: String,
		required: true,
		unique: true, 
		min: 3,
		max: 40
	},
	email: {
		type: String,
		required: true,
		unique: true,
		min: 9,
		max: 40
	},
	password: {
		type: String,
		required: true,
		min: 3,
		max: 40
	}, 
	phone: {
		type: String,
		required: true,
		min: 99999,
		max: 99999999999999
	},
	country: {
		type: String, 
		required: true
	}
});

userSchema.methods.hasSamePassword = function(requestedPassword) {
	return bcrypt.compareSync(requestedPassword, this.password);
};

userSchema.pre('save', function(next) {
	const user = this;

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			next();
		});
	});
});

function validateUser(user) {
	const schema = {
		nickname: Joi.string().min(3).max(40).required(),
		email: Joi.string().min(9).max(40).required().email(),
		password: Joi.string().min(3).max(40).required(),
		confirmPassword: Joi.string().min(3).max(40).required(),
		phone: Joi.number().min(99999).max(999999999999999).required(),
		country: Joi.string().required()
	};

	return Joi.validate(user, schema);
}

const User = mongoose.model('User', userSchema);

module.exports = {
	User,
	validateUser
};