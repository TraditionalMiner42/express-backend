const jwt = require("jsonwebtoken");

function generateRefreshToken(username) {
	const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, {
		expiresIn: "1d",
		algorithm: "HS256",
	});
	return refreshToken;
}

module.exports = {
	generateRefreshToken,
};
