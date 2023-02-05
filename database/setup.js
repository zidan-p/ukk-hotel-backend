



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
    Pemesanan.hasOne(DetailPemesanan);
    DetailPemesanan.belongsTo(Pemesanan);

    // -- detail pemesanan dengan kamar --
    DetailPemesanan.belongsToMany(Kamar, {
        through:'kamar_pemesanan_junction',
        as : "daftarKamar"
    });
    Kamar.belongsToMany(DetailPemesanan, {
        through:'kamar_pemesanan_junction',
        as : "daftarDetailPemesanan"
    });

    // -- detail pemesanan dengan tipe kamar 
    DetailPemesanan.belongsTo(TipeKamar);
    TipeKamar.hasMany(DetailPemesanan);
}


module.exports = {applyRelation};