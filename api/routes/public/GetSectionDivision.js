const express = require("express");
const pool = require("../../configs/DbConfig");
const router = express.Router();

router.get("/users/get_sections", async (req, res) => {
	const getSectionsQuery = `
        SELECT *
        FROM section
    `;

	pool.query(getSectionsQuery, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		return res.status(200).json({
			sections: result,
			message: "Retrieved all sections successfully",
		});
	});
});

router.get("/users/get_divisions", async (req, res) => {
	const getDivisionsQuery = `
        SELECT *
        FROM division
    `;

	pool.query(getDivisionsQuery, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
			return res.status(500).send({
				success: false,
				message: "Internal server error",
			});
		}
		return res.status(200).json({
			divisions: result,
			message: "Retrieved all divisions successfully",
		});
	});
});

module.exports = router;
