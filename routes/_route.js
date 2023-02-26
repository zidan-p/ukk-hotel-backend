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
const {endHandler, firstHandler} = require("../middleware/dataHandler");

// //import route
const userRouter = require("./user.route");
const tipeKamarRouter = require("./tipeKamar.route");
const kamarRouter = require("./kamar.route");
const pemesananRouter = require("./pemesanan.route");
const detailPemesananRouter = require("./detailPemesanan.route");
const authenticationRouter = require("./login.route");
const getFileRouter = require("./file.route");

// // Route
app.use("/user", firstHandler, userRouter, endHandler);
app.use("/tipe-kamar", firstHandler, tipeKamarRouter, endHandler);
app.use("/kamar", firstHandler, kamarRouter, endHandler );
app.use("/pemesanan", firstHandler, pemesananRouter, endHandler);
app.use("/detail-pemesanan", firstHandler, detailPemesananRouter, endHandler);
app.use(getFileRouter);
app.use("/", firstHandler, authenticationRouter, endHandler);




module.exports = app;