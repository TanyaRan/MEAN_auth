let profile = (req, res) => {
	res.status(200).json({
		profile: 'from controller users.profile'
	});
};

let updateProfile = (req, res) => {
	res.status(200).json({
		updateProfile: 'from controller users.updateProfile'
	});
};

module.exports = {
	profile,
	updateProfile
};