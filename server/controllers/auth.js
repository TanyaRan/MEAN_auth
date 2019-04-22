const { User, validateUser } = require('../models/user-model');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { normalizeErrors } = require('../helpers/normalize');

let login = async (req, res) => {
	const { email, password, rememberMe } = req.body;

	if (!password || !email) {
		return res.status(422).send({
			errors: [{ title: 'Data missing', detail: 'Provide email and password' }]
		});
	}

	if (user.hasSamePassword(password)) {
		const expiresInHours = rememberMe ? '6h' : '1h';
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email
			},
			config.SECRET,
			{ expiresIn: expiresInHours }
		);
			
		return res.json(token);
	} else {
		return res.status(422).send({
			errors: [{ title: 'Wrong data', detail: 'Wrong email or password' }]
		});
	}
};

let register = async (req, res) => {
	const { nickname, email, password, confirmPassword, phone, country } = req.body;
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(422).send(error.details[0].message);
	}

	if (password !== confirmPassword) {
		return res.status(422).send({
			errors: [
				{
					title: 'Invalid password',
					detail: 'You was not confirm password'
				}
			]
		});
	}

	let user = await User.findOne({email});
	if (user) { 
		return res.status(422).send({
			errors: [
				{
					title: 'Unique email',
					detail: 'User with this email already exists'
				}
			]
		});
	}

	user = await User.findOne({nickname});
	if (user) { 
		return res.status(422).send({
			errors: [
				{
					title: 'Unique nickname',
					detail: 'User with this nickname already exists'
				}
			]
		});
	}

	const newUser = new User({
		nickname,
		email,
		password,
		phone, 
		country
	});

	try {
		await newUser.save();
		res.status(201).json({
			newUser,
			message: 'User created successfully!'
		});
	} catch (err) {
		res.status(422).send({ errors: normalizeErrors(err.errors) });
	}
};

let authMiddleware = async (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		const userData = parseToken(token);

		await User.findById(userData.userId, (err, user) => {
			if (err) {
				return res.status(422).send({ errors: normalizeErrors(err.errors) });
			}

			if (user) {
				res.locals.user = user;
				next();
			} else {
				return notAuthorized(res);
			}
		});
	} else {
		return notAuthorized(res);
	}
};

function parseToken(token) {
	// 'Bearer abshriuy3249723p98' -> token's format
	return (decodedToken = jwt.verify(token.split(' ')[1], config.SECRET));
}

function notAuthorized(res) {
	return res.status(401).send({
		errors: [
			{ title: 'Not authorized', detail: 'You need to log in to get access' }
		]
	});
}

module.exports = {
	login,
	register,
	authMiddleware
};