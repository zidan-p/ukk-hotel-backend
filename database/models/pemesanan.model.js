const { DataTypes } = require('sequelize');
const {format} = require("date-fns")
const {generateRandomString} = require("./../../utils/randomString");

module.exports = (sequelize) => {
	sequelize.define('Pemesanan', {
        nomorPemesanan      : {
            allowNull       : true,
            type            : DataTypes.STRING,
            defaultValue    : () => {
                const date = format(new Date(), "yyyyMMLL-");
                const str = generateRandomString(5);
                return date + str
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
            type            : DataTypes.DATE
        },
        tglCheckIn        : {
            allowNull       : false,
            type            : DataTypes.DATE
        },
        tglCheckOut       : {
            allowNull       : false,
            type            : DataTypes.DATE
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