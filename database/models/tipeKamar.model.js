const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('TipeKamar', {
        namaTipeKamar : {
            allowNull   : false,
            type        : DataTypes.STRING,
            validate    : {
                notEmpty: {
                    msg : "harap sediakan nama tipe kamar"
                }
            }
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