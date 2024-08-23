const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const queryPromise = require("../../utilities/QueryPromise");
const router = express.Router();

router.delete(
	"/users/delete_booking/:bookingId",
	jwtValidate,
	async (req, res) => {
		const { bookingId } = req.params;
		console.log(bookingId);
		// const deleteQuery = `
		//     DELETE booking, participant
		//     FROM booking
		//     JOIN participant ON booking.booking_id = participant.booking_id
		//     WHERE booking.booking_id = ?;
		// `;
		// const deleteParticipantsQuery =
		// 	"DELETE FROM participant WHERE booking_id = ?";
		const deleteBookingQuery = "DELETE FROM booking WHERE booking_id = ?";
		try {
			// await queryPromise(deleteParticipantsQuery, [bookingId]);
			await queryPromise(deleteBookingQuery, [bookingId]);

			console.log(
				`Booking Id [${bookingId}] was deleted from booking and participant.`
			);
			res.status(200).send({
				success: true,
				message: "Booking was deleted from booking and participant.",
			});
		} catch (error) {
			console.log("Error executing query: ", error);
			res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
	}
);

module.exports = router;
