

// import controller
const detailPemesananController = require("./../controller/detailPemesanan.controller");


// Router
const Route = require("express").Router();


// GET
Route.get(
    "/:pemesanan_id",
    detailPemesananController.getDetailPemesananByPemesananId
)


// POST
Route.get(
    "/",
    detailPemesananController.createDetailPemesanan
)


// PUT
Route.put(
    "/:detail_pemesanan_id",
    detailPemesananController.updateDetailPemesanan
)


// DELETE
Route.delete(
    "/:detail_pemesanan_id",
    detailPemesananController.deleteDetailPemesanan
)

module.exports = Route






