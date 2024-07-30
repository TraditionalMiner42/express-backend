const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../../configs/DbConfig");
const { generateAccessToken } = require("../../controllers/AccessGenerate");
const { generateRefreshToken } = require("../../controllers/RefreshGenerate");
const router = express.Router();

// const sqlCheckQuery = `SELECT user_id FROM user WHERE username = ? AND password = ?`;
const sqlGetUserQuery = `SELECT user_id, password FROM user WHERE username = ?`;

// // Endpoint to check if username exists
// router.post("/users/signin/check_credential", (req, res) => {
// 	const { username, password } = req.body;
// 	const isPasswordMatched = bcrypt.compare(password);

// 	pool.query(sqlGetUserQuery, [username], (err, results) => {
// 		if (err) {
// 			console.error("Error executing query:", err);
// 			return res.status(500).send({
// 				success: false,
// 				message: "Internal server error",
// 			});
// 		}

// 		if (results.length > 0) {
// 			// User already exists, return error
// 			return res.status(500).send({
// 				success: false,
// 				message: "Username or password is not matched",
// 			});
// 		} else {
// 			// Username does not exist, return success
// 			return res.status(200).send({
// 				success: true,
// 				message: "Username and password are matched",
// 			});
// 		}
// 	});
// });

// Post sign in
router.post("/users/signin", async (req, res) => {
	// res.send("Signed in.");
	const { username, password } = req.body;

	// Execute query
	pool.query(sqlGetUserQuery, [username], async (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length === 0) {
			console.error("Error executing query:", err);
			return res.status(400).send({
				success: false,
				message: "Invalid username or password",
			});
		}

		const hashedPassword = results[0].password;
		console.log(results[0]);

		try {
			const isMatched = await bcrypt.compare(password, hashedPassword);

			if (isMatched) {
				const userId = results[0].user_id;
				const jwtAccessToken = generateAccessToken(username, userId);
				// const jwtRefreshToken = generateRefreshToken(username, userId);

				console.log("access: ", jwtAccessToken);
				return res.status(200).send({
					success: true,
					message: "Credentials are valid",
					username: username,
					userId: userId,
					jwtAccessToken,
					// jwtRefreshToken,
				});
			} else {
				res.status(400).send({
					success: false,
					message: "Invalid username or password",
				});
			}
		} catch (error) {
			console.error("Error comparing passwords:", error);
			res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}

		// console.log("refresh: ", jwtRefreshToken);

		// res.cookie("refreshToken", jwtRefreshToken, {
		// 	httpOnly: true,
		// 	secure: true,
		// });
	});
});

module.exports = router;
