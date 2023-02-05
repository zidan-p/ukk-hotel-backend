const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('DetailPemesanan', {
        hargaTotal     : {
            allowNull   : false,
            type        : DataTypes.BIGINT
        },
	},{
        tableName       : "detail_pemesanan"
    });
};