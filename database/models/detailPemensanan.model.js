const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('DetailPemesanan', {
        harga_total     : {
            allowNull   : false,
            type        : DataTypes.BIGINT
        },
	},{
        tableName       : "detail_pemesanan"
    });
};