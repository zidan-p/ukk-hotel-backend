


//import controller
const kamarController = require("./../controller/kamar.controller");
const {getTipeKamar} = require("./../controller/tipeKamar.controller")

//data handler
const dataHandler = require("./../middleware/dataHandler")

//ROuter
const Route = require("express").Router()

const authController = require("./../controller/authorization.controller");

// GET

Route.get(
    "/tipe-kamar/:tipe_kamar_id",
    getTipeKamar,
    kamarController.getKamarByTipeKamarId,
    dataHandler.endHandler
)

Route.get(
    "/:kamar_id",
    kamarController.getKamarFull,
    dataHandler.endHandler
)
    
Route.get(
    "/",
    kamarController.getAllkamar,
    dataHandler.endHandler
)

// POST

Route.post(
    "/create-many-with-tipe-kamar/:tipe_kamar_id",
    authController.authRole(["admin","resepsionis"]),
    getTipeKamar,
    kamarController.createKamarMany,
    dataHandler.endHandler
)

Route.post(
    "/search",
    kamarController.findSomeKamarByIdList,
    dataHandler.endHandler
)

Route.post(
    "/find-available-kamar",
    kamarController.findKamarThatAvailableInCertainInterval,
    dataHandler.endHandler
)

Route.post(
    "/create-one-with-tipe-kamar/:tipe_kamar_id",
    authController.authRole(["admin","resepsionis"]),
    getTipeKamar,
    kamarController.createKamarOne,
    dataHandler.endHandler
)
Route.post(
    "/create-bulk-with-tipe-kamar/:tipe_kamar_id",
    authController.authRole(["admin","resepsionis"]),
    getTipeKamar,
    kamarController.createKamarBulk,
    dataHandler.endHandler
)


//PUT
Route.put(
    "/:kamar_id",
    authController.authRole(["admin","resepsionis"]),
    kamarController.getKamar,
    kamarController.updateKamar,
    dataHandler.endHandler
)


//DELETE
Route.delete(
    "/:kamar_id",
    authController.authRole(["admin","resepsionis"]),
    kamarController.getKamar,
    kamarController.deleteKamar,
    dataHandler.endHandler
)


module.exports = Route