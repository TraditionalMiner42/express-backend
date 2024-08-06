const express = require("express");
const pool = require("../../configs/DbConfig");
const router = express.Router();

// Get all users
router.get("/users/get_user_name", (req, res) => {
	const username = req.query.username;
	const getUserQuery = `SELECT * FROM user WHERE username = ?`;
	pool.query(getUserQuery, [username], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length !== 0) {
			console.log(results[0].name);
			return res.status(200).json({
				users: results[0].name,
				message: "Retrived all users successfully",
			});
		}
	});
});

module.exports = router;
