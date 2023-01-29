const sequelize = require('./database');
const route = require("./routes/route");

const express = require('express')
const app = express()
const port = 3000

app.use(route);

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
		console.warn(sequelize.models);
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

assertDatabaseConnectionOk();

app.listen(port, () => {
	console.log("app listening on port" + port);
})

app.on('error', (e) => {
	console.error("ada yang bermasalah");v 
	console.log(e.message)
})