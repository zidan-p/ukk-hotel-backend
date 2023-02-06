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


//middleware
const {endHandler, firstHandler} = require("./../middleware/dataHandler");

//import route
const userRouter = require("./user.route");
const tipeKamarRouter = require("./tipeKamar.route");

//Route
app.use("/user", firstHandler, userRouter, endHandler);
app.use("/tipe-kamar", firstHandler, tipeKamarRouter, endHandler);





module.exports = app;