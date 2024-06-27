const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function to validate JWT token
function jwtValidate(req, res, next) {
	try {
		// If there's no authorization header, return status 401
		if (!req.headers["authorization"]) return res.sendStatus(401);

		console.log("authorized header: ", req.headers["authorization"]);

		// Replace "Bearer " from auth header
		const token = req.headers["authorization"].replace("Bearer ", "");
		console.log("token: ", token);
		console.log("secret: ", process.env.TOKEN_SECRET);

		if (token) {
			try {
				// Verify the token
				jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
					if (err) {
						console.error("test: ", err);
						return res.sendStatus(403); // Send forbidden response on verification failure
					}
					console.log("Token decoded successfully:", decoded);
					req.user = decoded; // Attach decoded token payload to request
					console.log(req.user);
					next(); // Continue with the next middleware or route handler
				});
			} catch (error) {
				return res.sendStatus(401); // Unauthorized
			}
		}
	} catch (error) {
		console.error("JWT validation error:", error);
		return res.sendStatus(500);
	}
}

module.exports = jwtValidate;
