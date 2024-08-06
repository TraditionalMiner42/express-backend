const express = require("express");
const pool = require("../../configs/DbConfig");
const bcrypt = require("bcrypt");
const router = express.Router();

// Endpoint to check if username exists
router.post("/users/signup/check_username", (req, res) => {
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

		console.log(results);

		if (results.length > 0) {
			// User already exists, return error
			return res
				.status(409)
				.send({ success: false, message: "User already exists" });
		} else {
			// Username does not exist, return success
			return res
				.status(200)
				.send({ success: true, message: "Username available" });
		}
	});
});

router.post("/users/signup", async (req, res) => {
	const { empId, fullname, division, section, username, password } = req.body;
	const sqlCheckQuery = `SELECT * FROM user WHERE username = ?`;

	console.log("testtt");

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	console.log("hashed pw: ", hashedPassword);

	const sqlInsertQuery = `
		INSERT INTO user (username, password, email, name, role, emp_id, section_id, division_id) 
		VALUES (?,?,DEFAULT,?,?,?,?,?)`;
	const insertedValues = [
		username,
		hashedPassword,
		fullname,
		1,
		empId,
		section,
		division,
	];

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
