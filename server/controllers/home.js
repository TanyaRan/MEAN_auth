let welcome = (req, res) => {
	res.status(200).json({
		welcome: 'from controller home.welcome'
	});
};

let about = (req, res) => {
	res.status(200).json({
		about: 'from controller home.about'
	});
};

module.exports = {
	welcome,
	about
};