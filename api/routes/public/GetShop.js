const express = require("express");
const pool = require("../../configs/DbConfig");
const router = express.Router();

router.get("/users/shop_menu", async (req, res) => {
	const getMenuCafeQuery = `
        SELECT s.shop_id, s.shop_name, m.menu_id, m.menu_name
        FROM shop_menu sm
        JOIN shop s ON sm.shop_id = s.shop_id
        JOIN menu m ON sm.menu_id = m.menu_id`;

	// const getMenuCafe1Query = `SELECT menu_id, menu_name FROM cafe_1`;
	// const getMenuCafe2Query = `SELECT menu_id, menu_name FROM cafe_2`;

	try {
		const [cafeResults] = await pool.promise().query(getMenuCafeQuery);

		// console.log(cafeResults[0].shop_id);

		return res.status(200).json({
			cafe_menu: cafeResults,
			message: "Retrieved menu successfully",
		});
	} catch (err) {
		console.error("Error executing queries:", err);
		return res.status(500).send({
			success: false,
			message: "Internal server error",
		});
	}
});

module.exports = router;
