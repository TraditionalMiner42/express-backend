const express = require("express");
const pool = require("../../configs/DbConfig");
const { generateAccessToken } = require("../../controllers/AccessGenerate");
const { generateRefreshToken } = require("../../controllers/RefreshGenerate");
const router = express.Router();

const sqlCheckQuery = `SELECT user_id FROM user WHERE username = ? AND password = ?`;

// Endpoint to check if username exists
router.post("/users/signin/check_credential", (req, res) => {
	const { username, password } = req.body;

	pool.query(sqlCheckQuery, [username, password], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}

		if (results.length > 0) {
			// User already exists, return error
			return res.status(500).send({
				success: false,
				message: "Username or password is not matched",
			});
		} else {
			// Username does not exist, return success
			return res.status(200).send({
				success: true,
				message: "Username and password are matched",
			});
		}
	});
});

// Post sign in
router.post("/users/signin", (req, res) => {
	// res.send("Signed in.");
	const { username, password } = req.body;

	// Execute query
	pool.query(sqlCheckQuery, [username, password], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length === 0) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Username or password is not matched",
			});
		} else if (results.length === 1) {
			const userId = results[0].user_id;
			const jwtAccessToken = generateAccessToken(username, userId);
			const jwtRefreshToken = generateRefreshToken(username, userId);

			console.log("access: ", jwtAccessToken);
			// console.log("refresh: ", jwtRefreshToken);

			// res.cookie("refreshToken", jwtRefreshToken, {
			// 	httpOnly: true,
			// 	secure: true,
			// });

			return res.status(200).send({
				success: true,
				message: "User signed in successfully",
				username: username,
				userId: userId,
				jwtAccessToken,
				// jwtRefreshToken,
			});
		}
	});
});

module.exports = router;
