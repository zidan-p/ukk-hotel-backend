const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('Pemesanan', {
        nomor_pemesanan     : {
            allowNull       : false,
            type            : DataTypes.UUID
        },
        nama_pemesan        : {
            allowNull       : false,
            type            : DataTypes.STRING
        },
        email_pemesan       : {
            allowNull       : false,
            type            : DataTypes.STRING
        },
        tgl_pemesanan       : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        tgl_check_in        : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        tgl_check_out       : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        status              :{
            type            : DataTypes.ENUM(
                "baru",
                "check_in", 
                "check_out"
            ),
            defaultValue : "baru"
        }

	},{
        tableName       : "pemesanan"
    });
};