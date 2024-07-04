const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const router = express.Router();

// Get specific user based on the request
router.get("/users/get_user", jwtValidate, (req, res) => {
	const decodedUser = req.user;
	const userId = decodedUser.userId;

	const getUsersQuery = `SELECT * FROM user where user_id = ?`;

	// Execute query
	pool.query(getUsersQuery, [userId], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length !== 0) {
			const filteredResults = {
				user_id: results[0].user_id,
				username: results[0].username,
				role: results[0].role,
			};
			console.log(results[0]);
			return res.status(200).json({
				user: filteredResults,
				message: "Retrived all users successfully",
			});
		}
	});
});

module.exports = router;
