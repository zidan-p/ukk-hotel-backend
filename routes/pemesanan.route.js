//Router
const Route = require("express").Router();

//import controller
const pemesananController = require("./../controller/pemesanan.controller")
const kamarController = require("./../controller/kamar.controller")
const tipeKamarController = require("./../controller/tipeKamar.controller");
const detailPemesananController = require("./../controller/detailPemesanan.controller");


//data handler
const dataHandler = require("./../middleware/dataHandler")


// GET
Route.get(
    "/",
    pemesananController.getAllPemesanan,
    dataHandler.endHandler
)

Route.get(
    "/full",
    pemesananController.getAllPemesananFull,
    dataHandler.endHandler
)

Route.get(
    "/find/full/:pemesanan_id",
    pemesananController.getPemesananFull,
    dataHandler.endHandler
)

Route.get(
    "/find/:pemesanan_id",
    pemesananController.getPemesanan,
    dataHandler.endHandler
)
    

        


// POST

Route.post(
    "/transaction-direct",
    kamarController.findSomeKamarByIdList,                      
    tipeKamarController.findTipeKamar, 
    pemesananController.createPemesananDirect,
    detailPemesananController.attachDetailPemesananToKamar,
    detailPemesananController.attachDetailPemesananToTipeKamar,
    dataHandler.endHandler
)
    
Route.post(
    // mungkin disini akan dijadikan sebagai middleware yg nantinya akan 
    // akan digunakan untuk membuat resiv.
    // akan dikirim data request pemesanan + tipe kamar + kamar yg dipilih.
    // dilakuakn pula validasi untuk kamar yg dipilih supaya sesuai dengan tipe kamar.
    // jangan lupa pula untuk melakukan assosiasi 
    "/transaction",
    kamarController.findSomeKamarByIdList,                      // cek apakah ada kamar
    tipeKamarController.findTipeKamar,                          // cek apakah tipe kamar tersedia
    kamarController.checkIfTipeKamarIsCorrespond,               // cek apakah array kamar yang dinputkan sudah sesuai
    pemesananController.createPemesanan,                        // buat pemesanan terlebihdahulu untuk wadahnya
    detailPemesananController.createDetailPemesanan,            // membuat detail pemesanan
    detailPemesananController.attachDetailPemesananToPemesanan, // buat assosiasi untuk pemesanan dengan detail pemesanan
    detailPemesananController.attachDetailPemesananToKamar,     // assosiasi antara detail pemesanan dengan kamar
    detailPemesananController.attachDetailPemesananToTipeKamar, // asosiasi untuk tipe kamar dan detail pemesanan
    dataHandler.endHandler
)

// PUT
Route.put(
    "/:pemesanan_id",
    pemesananController.getPemesanan,
    pemesananController.updatePemesanan,
    dataHandler.endHandler
)


// DELETE
Route.delete(
    "/:pemesanan_id",
    pemesananController.getPemesanan,
    pemesananController.deletePemesanan,
    dataHandler.endHandler
)

module.exports = Route