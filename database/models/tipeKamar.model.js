const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('TipeKamar', {
        nama_tipe_kamar : {
            allowNull   : false,
            type        : DataTypes.STRING
        },
        harga           : {
            allowNull   : true,
            type        : DataTypes.BIGINT,
            defaultValue: 0
        },
        deskripsi       : {
            allowNull   : true,
            type        : DataTypes.TEXT
        },
        foto            : {
            allowNull   : true,
            type        : DataTypes.TEXT
        }
	},{
        tableName       : "tipe_kamar"
    });
};