//Router
const Route = require("express").Router();

//import controller
const pemesananController = require("./../controller/pemesanan.controller")

// GET
Route.get(
    "/",
    pemesananController.getAllPemesananOnly
)

Route.get(
    "/full",
    pemesananController.getAllPemesananWithChild
)

Route.get(
    "/:pemesanan_id",
    pemesananController.getPemesananOnly,
)

Route.get(
    "/full/:pemesanan_id",
    pemesananController.getPemesananwithChild
)


// POST
Route.post(
    "/",
    pemesananController.createPemesananOnly
)

Route.post(
    "/direct",
    pemesananController.createPemesananDirect
)


// PUT
Route.put(
    "/:pemesanan_id",
    pemesananController.updatePemesanan
)


// DELETE
Route.delete(
    "/:pemesanan_id",
    pemesananController.deletePemesanan
)

module.exports = Route