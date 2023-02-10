



function applyRelation(sequelize){

    //model
    const {
        DetailPemesanan, 
        Kamar, 
        Pemesanan, 
        TipeKamar, 
        User
    } = sequelize.models

    // -- kamar dengan tipe kamar --
    Kamar.belongsTo(TipeKamar);
    TipeKamar.hasMany(Kamar);

    // -- pemesanan dengan user(admin), pemvalidasi pemesanan --
    Pemesanan.belongsTo(User);
    User.hasMany(Pemesanan);

    // -- pemesanan dengan detail pemesanan --
    Pemesanan.hasOne(DetailPemesanan,{
        onDelete : "CASCADE"
    });
    DetailPemesanan.belongsTo(Pemesanan);

    // -- detail pemesanan dengan kamar --
    DetailPemesanan.belongsToMany(Kamar, {
        through:'kamar_pemesanan_junction',
        as : "DaftarKamar",
    });
    Kamar.belongsToMany(DetailPemesanan, {
        through:'kamar_pemesanan_junction',
        as : "DaftarDetailPemesanan"
    });

    // -- detail pemesanan dengan tipe kamar 
    DetailPemesanan.belongsTo(TipeKamar,{
        as : "TipeKamarPemesanan"
    });
    TipeKamar.hasMany(DetailPemesanan,{
        as : "DaftarPemesanan"
    });
}


module.exports = {applyRelation};