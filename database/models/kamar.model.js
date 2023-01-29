const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Kamar', {
        nomor_kamar         : {
            allowNull       : false,
            type            : DataTypes.INTEGER
        },
        nama                : {
            allowNull       : true,
            type            : DataTypes.STRING
        }
	},{
        tableName       : "kamar"
    });
};