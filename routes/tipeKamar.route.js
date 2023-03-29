//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");


//data handler
const dataHandler = require("./../middleware/dataHandler")

// ROuter
const Route = require("express").Router();

//Controller
const tipeKamarController = require("./../controller/tipeKamar.controller");
const authController = require("./../controller/authorization.controller");
const multer = require('multer');

//GET
Route.get(
    "/",
    tipeKamarController.getAllTipeKamar,
    dataHandler.endHandler
)

Route.get(
    "/filter",
    tipeKamarController.getTipeKamarFiltered,
    dataHandler.endHandler
)

Route.get(
    "/full/:tipe_kamar_id",
    tipeKamarController.getTipeKamarFull,
    dataHandler.endHandler
)

Route.get(
    "/:tipe_kamar_id",
    tipeKamarController.getTipeKamar,
    dataHandler.endHandler
)


//POST V
Route.post(
    "/",
    authController.authRole(["admin","resepsionis"]),
    uploadFile("foto"),
    tipeKamarController.createTipeKamar,
    dataHandler.endHandler
)

//PUT
Route.put(
    "/:tipe_kamar_id",
    authController.authRole(["admin","resepsionis"]),
    uploadFile("foto"),
    tipeKamarController.getTipeKamar,
    tipeKamarController.updateTipeKamar,
    dataHandler.endHandler
)

//DELETE
Route.delete(
    "/:tipe_kamar_id",
    authController.authRole(["admin","resepsionis"]),
    tipeKamarController.deleteTipeKamar,
    dataHandler.endHandler
)



module.exports = Route