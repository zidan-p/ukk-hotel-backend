//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");


// ROuter
const Route = require("express").Router();

//Controller
const tipeKamarController = require("./../controller/tipeKamar.controller");
const multer = require('multer');

//GET
Route.get(
    "/",
    tipeKamarController.getAllTipeKamar
)

Route.get(
    "/full/:tipe_kamar_id",
    tipeKamarController.getTipeKamarFull
)

Route.get(
    "/:tipe_kamar_id",
    tipeKamarController.getTipeKamar
)


//POST V
Route.post(
    "/",
    uploadFile("foto"),
    tipeKamarController.createTipeKamar   
)

//PUT
Route.put(
    "/:tipe_kamar_id",
    uploadFile("foto"),
    tipeKamarController.getTipeKamar,
    tipeKamarController.updateTipeKamar
)

//DELETE
Route.delete(
    "/:tipe_kamar_id",
    tipeKamarController.deleteTipeKamar
)



module.exports = Route