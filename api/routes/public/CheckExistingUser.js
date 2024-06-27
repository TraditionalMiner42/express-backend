const express = require("express");
const pool = require("../../configs/DbConfig");
const router = express.Router();

// Check if the request user exists in db
router.post("/users/check_existing_users", (req, res) => {
	const { username } = req.body;
	const sqlCheckQuery = `SELECT * FROM user WHERE username = ?`;

	pool.query(sqlCheckQuery, [username], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}

		if (results.length > 0) {
			// User already exists, return error
			return res
				.status(409)
				.send({ success: false, message: "User already exists" });
		} else {
			// Execute the insert query
			pool.query(sqlInsertQuery, insertedValues, (err, results) => {
				if (err) {
					console.error("Error executing query:", err);
					return res.status(500).send({
						success: false,
						message: "Error signing up user",
					});
				}
				console.log("User signed up successfully");
				// Send a success response if the user is signed up successfully
				return res.status(200).send({
					success: true,
					message: "User signed up successfully",
				});
			});
		}
	});
});

module.exports = router;
