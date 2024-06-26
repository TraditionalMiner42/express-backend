// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
// const accessValidation = require("./middlewares/AccessValidation");
const pool = require("./configs/DbConfig");
const RoomRoute = require("./routes/protected/RoomBooking");
const SigninRoute = require("./routes/public/Signin");
const SignupRoute = require("./routes/public/Signup");
const GetUsersRoute = require("./routes/public/GetUsers");
const GetBookingsRoute = require("./routes/protected/GetBookings");
const InsertMoreInfo = require("./routes/protected/InsertMoreInfo");

const GetUserRoute = require("./routes/protected/GetUser");
const GetUserBookingsRoute = require("./routes/protected/GetUserBookings");

require("dotenv").config();

// Set the port number
const port = 4000;

// Create an Express application
const app = express();

app.use(cors());

// Use body-parser middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

app.use(SigninRoute);
app.use(SignupRoute);
app.use(RoomRoute);
app.use(GetUsersRoute);
app.use(GetBookingsRoute);
app.use(GetUserRoute);
app.use(GetUserBookingsRoute);
app.use(InsertMoreInfo);

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
