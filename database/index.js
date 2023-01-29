const { Sequelize } = require('sequelize');
const { applyRelation } = require('./setup')
const { config } = require('./../config/database.config');

// define sequelize
const sequelize = new Sequelize(
	config.db_name,
	config.username,
	config.password,
	{
		host : config.dbms.host,
		dialect : config.dbms.dialect,
		logging : config.logging,
		define: {
			freezeTableName: true
		}
	}
);

const modelDefiners = [
	require('./models/detailPemensanan.model'),
	require('./models/kamar.model'),
    require('./models/pemesanan.model'),
    require('./models/tipeKamar.model'),
    require('./models/user.model')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

//sync database 
async function syncDb(){
	await sequelize.sync({alter: true})
}

syncDb();

//terapkan setup tambahan
applyRelation(sequelize);


// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;