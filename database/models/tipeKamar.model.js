const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('TipeKamar', {
        namaTipeKamar : {
            allowNull   : true,
            type        : DataTypes.STRING,
            // -- saya tidak tahu mengapa ini begini --
            // validate    : {
            //     notEmpty: {
            //         msg : "harap sediakan nama tipe kamar"
            //     }
            // },
            defaultValue: "Kamar Hotel"
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