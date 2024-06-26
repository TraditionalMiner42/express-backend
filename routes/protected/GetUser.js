const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const router = express.Router();

router.get("/users/get_user", jwtValidate, (req, res) => {
	const decodedUser = req.user;
	const userId = decodedUser.userId;

	const getUsersQuery = `SELECT * FROM user where user_id = ?`;
	pool.query(getUsersQuery, [userId], (err, results) => {
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
				user: results,
				message: "Retrived all users successfully",
			});
		}
	});
});

module.exports = router;
