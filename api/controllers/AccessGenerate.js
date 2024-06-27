const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT access token
function generateAccessToken(username, userId) {
	const accessToken = jwt.sign(
		{ username, userId },
		process.env.TOKEN_SECRET,
		{
			expiresIn: "7d",
			algorithm: "HS256",
		}
	);
	const decoded = jwt.decode(accessToken);
	const expirationDateTime = new Date(decoded.exp * 1000);

	console.log(`Generated token for ${username}:`, decoded);
	console.log(`Token expired date: `, expirationDateTime);
	return accessToken;
}

module.exports = {
	generateAccessToken,
};
