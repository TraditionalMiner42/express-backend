// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// const accessValidation = require("./middlewares/AccessValidation");
const RoomRoute = require("./routes/protected/RoomBooking");
const SigninRoute = require("./routes/public/Signin");
const SignupRoute = require("./routes/public/Signup");
const GetUsersRoute = require("./routes/public/GetUsers");
const GetBookingsRoute = require("./routes/protected/GetBookings");
const InsertMoreInfo = require("./routes/protected/InsertMoreInfo");
const DeleteBooking = require("./routes/protected/DeleteBooking");

const GetUserRoute = require("./routes/protected/GetUser");
const GetUserBookingsRoute = require("./routes/protected/GetUserBookings");

const GetSectionDivision = require("./routes/public/GetSectionDivision");
const GetUsers = require("./routes/public/GetUsers");

require("dotenv").config();

// Set the port number
const port = 4000;

// Create an Express application
const app = express();

app.use(cors());

// Use body-parser middleware to parse JSON data
app.use(express.json());

app.use(GetUsers);
app.use(GetSectionDivision);
app.use(SigninRoute);
app.use(SignupRoute);
app.use(RoomRoute);
app.use(GetUsersRoute);
app.use(GetBookingsRoute);
app.use(GetUserRoute);
app.use(GetUserBookingsRoute);
app.use(InsertMoreInfo);
app.use(DeleteBooking);

// Start the server
app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
