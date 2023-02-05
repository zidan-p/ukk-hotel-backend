


//import controller
const kamarController = require("./../controller/kamar.controller");


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
    "/",
    kamarController.createKamarOne
)

Route.post(
    "/many",
    kamarController.createKamarMany
)

Route.post(
    "/search",
    kamarController.getSomeKamarByIdList
)

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