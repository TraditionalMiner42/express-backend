const express = require("express");
const jwtValidate = require("../../middlewares/AccessValidation");
const { jwtDecode } = require("jwt-decode");
const pool = require("../../configs/DbConfig");
const { decode } = require("jsonwebtoken");
const router = express.Router();

const getRoomId = (roomName) => {
	return new Promise((resolve, reject) => {
		const getRoomIdQuery = `SELECT room_id FROM room WHERE room_name = ?`;
		pool.query(getRoomIdQuery, [roomName], (err, results) => {
			if (err) {
				return reject(err);
			}
			if (results.length === 0) {
				return resolve(null);
			}
			resolve(results[0].room_id);
		});
	});
};

const checkAvailability = async (modifiedFormValues, roomId) => {
	const sqlCheckQuery = ` 
        SELECT booking_date, selected_room, booking_start_time, booking_end_time
        FROM booking
        WHERE booking_date = ? 
        AND selected_room = ?
        AND (
            (booking_start_time < ? AND booking_end_time > ?) OR
            (booking_start_time < ? AND booking_end_time > ?)
        );
    `;
	const checkValues = [
		modifiedFormValues.dateStart,
		roomId,
		modifiedFormValues.timeEnd,
		modifiedFormValues.timeStart,
		modifiedFormValues.timeEnd,
		modifiedFormValues.timeStart,
	];

	return await new Promise((resolve, reject) => {
		pool.query(sqlCheckQuery, checkValues, (error, results) => {
			if (error) {
				return reject(error);
			}
			console.log("results: ", results);
			resolve(results.length !== 0);
		});
	});
};

const insertBooking = async (modifiedFormValues, userId, roomId) => {
	// const decoded = jwtDecode(userToken.token);
	// const userId = decoded.userId;
	// console.log(decoded.userId);
	const sqlInsertQuery = `
        INSERT INTO booking (topic, booking_date, booking_start_time, booking_end_time, selected_room, user_id, booking_status) 
        VALUES (?,?,?,?,?,?,?);
    `;
	const insertedValues = [
		modifiedFormValues.meetingTopic,
		modifiedFormValues.dateStart,
		modifiedFormValues.timeStart,
		modifiedFormValues.timeEnd,
		roomId,
		userId,
		1,
	];

	return new Promise((resolve, reject) => {
		pool.query(sqlInsertQuery, insertedValues, (error, results) => {
			if (error) {
				return reject(error);
			}
			resolve({ insertId: results.insertId, userId: userId });
		});
	});
};

// const insertParticipants = async (participants, bookingId) => {
// 	const participantInsertQueries = participants.map((participantName) => {
// 		return new Promise((resolve, reject) => {
// 			const sqlParticipantInsertQuery = `
//                 INSERT INTO participant (participant_name, booking_id)
//                 VALUES (?, ?);
//             `;
// 			const participantInsertedValues = [
// 				participantName.trim(),
// 				bookingId,
// 			];
// 			pool.query(
// 				sqlParticipantInsertQuery,
// 				participantInsertedValues,
// 				(error, results) => {
// 					if (error) {
// 						return reject(error);
// 					}
// 					resolve(results);
// 				}
// 			);
// 		});
// 	});

// 	return Promise.all(participantInsertQueries);
// };

router.post("/users/rooms", jwtValidate, async (req, res) => {
	try {
		const { modifiedFormValues } = req.body;
		// console.log(userToken);
		// const decoded = jwtDecode(userToken.token);

		// console.log(decoded);

		console.log(modifiedFormValues);
		// console.log(req.user.userId);

		const roomId = await getRoomId(modifiedFormValues.room);
		console.log("submitted room id: ", roomId);

		const isBooked = await checkAvailability(modifiedFormValues, roomId);
		if (isBooked) {
			return res.status(409).send({
				success: false,
				message: "Specified datetime was already booked",
			});
		}

		await insertBooking(modifiedFormValues, req.user.userId, roomId);

		// console.log(bookingId.userId);

		// const participants = modifiedFormValues.participants.split(",");
		// await insertParticipants(participants, req.user.userId);

		console.log("Form data inserted successfully.");
		res.send({
			success: true,
			userId: req.user.userId,
			modifiedFormValues,
		});
	} catch (error) {
		console.error("Error processing request:", error);
		res.status(500).send({
			success: false,
			message: "Internal server error",
		});
	}
});

router.get("/users/get_rooms", (req, res) => {
	const getRoomsQuery = `SELECT * FROM room`;
	pool.query(getRoomsQuery, (err, results) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		if (results.length !== 0) {
			return res.status(200).json({
				rooms: results,
				message: "Retrieved all rooms successfully",
			});
		} else {
			return res.status(404).json({
				message: "No rooms found",
			});
		}
	});
});

module.exports = router;
