const { DataTypes } = require('sequelize');
const {format} = require("date-fns")
const {generateRandomString} = require("./../../utils/randomString");

module.exports = (sequelize) => {
	sequelize.define('Pemesanan', {
        nomorPemesanan     : {
            allowNull       : false,
            type            : DataTypes.UUID,
            primaryKey      : true,
            set(){
                const date = format(new Date(), "YYYYMMLL-");
                const str = generateRandomString(5);
                this.setDataValue("nomor_pemesanan", date + str)
            }
        },
        namaPemesan        : {
            allowNull       : false,
            type            : DataTypes.STRING
        },
        emailPemesan       : {
            allowNull       : false,
            type            : DataTypes.STRING
        },
        tglPemesanan       : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        tglCheckIn        : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        tglCheckOut       : {
            allowNull       : false,
            type            : DataTypes.TIME
        },
        status              :{
            type            : DataTypes.ENUM(
                "baru",
                "diterima",
                "check_in", 
                "check_out"
            ),
            defaultValue : "baru"
        }

	},{
        tableName       : "pemesanan"
    });
};