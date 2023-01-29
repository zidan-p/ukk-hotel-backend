const { DataTypes, SequelizeValidationError } = require('sequelize');
const bcrypt = require("bcrypt");


module.exports = (sequelize) => {
	sequelize.define('User', {
        username        : {
            allowNull   : false,
            type        : DataTypes.STRING,
            validate    : {
                notEmpty: {
                    msg : "harap isi username"
                }
            },
            unique      : {
                msg     : "username sudah terpakai"
            }
        },
        foto            : {
            allowNull   : true,
            type        : DataTypes.TEXT
        },
        email           : {
            allowNull   : false,
            type        : DataTypes.STRING,
            validate    : {
                isEmail : {msg : "format email tidak benar"}
            }
        },
        password        : {
            allowNull   : false,
            type        : DataTypes.TEXT,
            validate    : {
                notEmpty: {
                    msg : "password tidak boleh kosong"
                },
                len     : { // note validation ini hanya untuk validation level database, jadi mau diberi string apapun tetap tidak gagal
                    args: [4],
                    msg : "password minimal 4 karakter"
                }
            },
            set(value) {
                // if (value.length >= 8 ) {
                    this.setDataValue('password', bcrypt.hashSync(value, 10));
                // } else {
                //     throw new SequelizeValidationError('password harus lebih dari 8 karakter');
                // }
            }
        },
        role : {
            allowNull   : false,
            type        : DataTypes.ENUM("admin", "resepsionis"),
            validate    : {
                isIn    : {
                    args: [['admin', 'resepsionis']],
                    msg : "role tidak valid"
                }
            },
            defaultValue: "resepsionis"
        }
	},{
        tableName       : "user"
    });
};