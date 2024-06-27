const express = require("express");
const pool = require("../../configs/DbConfig");
const router = express.Router();

// Get all users
router.get("/users/get_users", (req, res) => {
	const getUsersQuery = `SELECT * FROM user`;
	pool.query(getUsersQuery, (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length !== 0) {
			console.log(results);
			return res.status(200).json({
				users: results,
				message: "Retrived all users successfully",
			});
		}
	});
});

module.exports = router;
