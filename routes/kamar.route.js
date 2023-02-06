


//import controller
const kamarController = require("./../controller/kamar.controller");
const {getTipeKamar} = require("./../controller/tipeKamar.controller")

//ROuter
const Route = require("express").Router()

// GET
Route.get(
    "/",
    kamarController.getAllkamar
)

Route.get(
    "/:kamar_id",
    kamarController.getKamar
)

Route.get(
    "/tipe-kamar/:tipe_kamar_id",
    kamarController.getKamarByTipeKamarId
)


// POST

Route.post(
    "/create-many-with-tipe-kamar/:tipe_kamar_id",
    getTipeKamar,
    kamarController.createKamarMany
)

Route.post(
    "/search",
    kamarController.getSomeKamarByIdList
)


Route.post(
    "/create-one-with-tipe-kamar/:tipe_kamar_id",
    getTipeKamar,
    kamarController.createKamarOne
)
Route.post(
    "/create-bulk-with-tipe-kamar/:tipe_kamar_id",
    getTipeKamar,
    kamarController.createKamarBulk
)

//not safe
//tidak bisa karena setiap kamar perlu relasi dengan tipe kamar
// Route.post(
//     "/",
//     kamarController.createKamarOne
// )


//PUT
Route.put(
    ":/kamar_id",
    kamarController.updateKamar
)


//DELETE
Route.delete(
    "/kamar_id",
    kamarController.deleteKamar
)


module.exports = Route