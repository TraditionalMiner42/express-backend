const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const moment = require("moment/moment");
const router = express.Router();

router.get("/users/get_bookings", jwtValidate, (req, res) => {
	const getBookingsQuery = `
		SELECT b.*, r.* 
		FROM booking b
		JOIN room r ON b.selected_room = r.room_id
		ORDER BY b.booking_date, b.booking_start_time
	`; // Adjust query as needed
	pool.query(getBookingsQuery, (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}

		// Process bookings to determine isFirstBookingOfDay
		let processedBookings = [];
		let previousDate = null;

		results.forEach((booking) => {
			const currentBookingDate = moment(booking.booking_date).format(
				"YYYY-MM-DD"
			);

			// Check if this is the first booking of the day
			if (currentBookingDate !== previousDate) {
				booking.isFirstBookingOfDay = true;
				previousDate = currentBookingDate;
			} else {
				booking.isFirstBookingOfDay = false;
			}
			console.log("isFirstBookingOfDay: ", booking.isFirstBookingOfDay);

			processedBookings.push(booking);
		});

		console.log(
			`Processed bookings [${processedBookings.length}]: `,
			processedBookings
		);

		console.log(results);
		return res.status(200).json({
			bookings: processedBookings,
			message: "Retrieved all bookings successfully",
		});
	});
});

module.exports = router;
