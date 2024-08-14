const express = require("express");
const pool = require("../../configs/DbConfig");
const jwtValidate = require("../../middlewares/AccessValidation");
const moment = require("moment/moment");
const queryPromise = require("../../utilities/QueryPromise");
const router = express.Router();

// Get meals and participants
router.get("/users/get_break_details", jwtValidate, (req, res) => {
	const getBreaksQuery = `
        SELECT * 
        FROM participant p
        JOIN booking b ON p.booking_id = b.booking_id
        ORDER BY p.booking_id
    `;

	// Execute query
	pool.query(getBreaksQuery, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		return res.status(200).json({
			bookings: result,
			message: "Retrieved all breaks successfully",
		});
	});
});

// Post meals and participants
router.post("/users/add_break_meals", jwtValidate, (req, res) => {
	const { meal, bookingId, editedTopic } = req.body;
	console.log("participants and beverages: ", meal);

	const insertQuery = `
        INSERT INTO participant (participant_name, booking_id, beverage)
        VALUES (?, ?, ?);
    `;
	// const updateTopicQuery = `
	// 	UPDATE booking
	// 	SET topic = ?
	// 	WHERE booking_id = ?
	// `;

	// Use async/await to handle the insertion sequentially
	const insertParticipants = async () => {
		try {
			// Insert participants and drinks
			for (const [index, mealItem] of meal.entries()) {
				console.log(`meal ${index}: `, mealItem);
				await queryPromise(insertQuery, [
					mealItem.name,
					bookingId,
					mealItem.drink,
				]);
				console.log("Participant and beverage inserted successfully.");
			}
			// // Update topic
			// const updateResult = await queryPromise(updateTopicQuery, [
			// 	editedTopic,
			// 	bookingId,
			// ]);
			// console.log("Topic updated successfully:", updateResult);
			res.status(200).send({
				success: true,
				message: "Participants and beverages inserted successfully.",
			});
		} catch (error) {
			console.error("Error executing query:", error);
			res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
	};

	insertParticipants();
});

// Post updated booking topic
router.post("/users/rename_topic", jwtValidate, async (req, res) => {
	const { editedTopic, bookingId } = req.body;
	const updateTopicQuery = `
		UPDATE booking
		SET topic = ?
		WHERE booking_id = ?
	`;
	if (!editedTopic || !bookingId) {
		return res
			.status(400)
			.json({ success: false, message: "Missing required fields" });
	}
	try {
		await queryPromise(updateTopicQuery, [editedTopic, bookingId]);
		res.status(200).json({
			success: true,
			message: "Topic updated successfully",
		});
	} catch (error) {
		console.error("Error updating topic:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
});

module.exports = router;
