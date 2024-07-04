const pool = require("../configs/DbConfig");

// Convert pool.query to return a promise
const queryPromise = (query, values) => {
	return new Promise((resolve, reject) => {
		pool.query(query, values, (error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
};

module.exports = queryPromise;
