
//import middleware handler
const dataHandler = require("./../middleware/dataHandler")

// import controller
const detailPemesananController = require("./../controller/detailPemesanan.controller");
const pemesananController = require("./../controller/pemesanan.controller");
const kamarController = require("./../controller/kamar.controller");
const tipeKamarController = require("./../controller/tipeKamar.controller");


// Router
const Route = require("express").Router();


// GET
Route.get(
    "/pemesanan-id/:pemesanan_id",
    detailPemesananController.getDetailPemesananByPemesananId,
    dataHandler.endHandler
)

Route.get(
    "/find/full/:detail_pemesanan_id",
    detailPemesananController.getDetailPemesananFull,
    dataHandler.endHandler
)

Route.get(
    "/find/:detail_pemesanan_id",
    detailPemesananController.getDetailPemesanan,
    dataHandler.endHandler
)

Route.get(
    "/full", 
    detailPemesananController.getAllDetailPemesananFull,
    // (req,res) => {return res.status(200).json({test : req.UKK_BACKEND})},
    dataHandler.endHandler
)


Route.get(
    "/",
    detailPemesananController.getAllDetailPemesanan,
    dataHandler.endHandler
)

    
// POST
// tidak perlu ini, create dibuat di pemesanan
// Route.get(
//     "/",
//     detailPemesananController.createDetailPemesanan
// )


// PUT

Route.put(
    "/:detail_pemesanan_id",
    detailPemesananController.getDetailPemesananFull,
    kamarController.findSomeKamarByIdList,
    detailPemesananController.updateDetailPemesanan,
    detailPemesananController.updateKamarAssociation,
    dataHandler.endHandler
)



// DELETE
Route.delete(
    "/:detail_pemesanan_id",
    detailPemesananController.getDetailPemesanan,
    detailPemesananController.deleteDetailPemesanan,
    dataHandler.endHandler
)

module.exports = Route






