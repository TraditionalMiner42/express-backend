const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const router = express.Router();

// Get bookings based on the specific user
router.get("/users/get_user_bookings", (req, res) => {
	const userId = req.query.userId;

	console.log("user_id: ", userId);

	const getBookingsQuery = `
		SELECT b.*, r.* 
		FROM booking b
		JOIN room r ON b.selected_room = r.room_id
        WHERE user_id = ?
	`;

	// Execute query
	pool.query(getBookingsQuery, [userId], (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		console.log("bookings length: ", results.length);
		console.log(results);
		return res.status(200).json({
			bookings: results,
			message: "Retrieved all bookings successfully",
		});
	});
});

module.exports = router;
