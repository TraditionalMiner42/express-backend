const jwt = require("jsonwebtoken");

// Generate refresh token (this function is currently not being used)
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
