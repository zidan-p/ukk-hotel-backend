const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Kamar', {
        nama                : {
            allowNull       : true,
            type            : DataTypes.STRING
        }
	},{
        tableName       : "kamar"
    });
};