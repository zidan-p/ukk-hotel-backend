const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer")


//Setup
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
// app.use(multer().any()); //cara kasar untuk menghandle form data, harap dihindari


//import route
const userRouter = require("./user.route");


//Route
app.use("/user", userRouter);






module.exports = app;