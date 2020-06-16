const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
	client: 'pg',
	connection: DATABASE_URL
});

app.set('db', db);

// to DEBUG database connection
console.log('NODE_ENV = ', process.env.NODE_ENV);
console.log('DATABASE_URL = ', DATABASE_URL);
console.log('----------------');
const qry = db
	.select('*')
	.from(process.env.TEST_TABLE)
	.toQuery();

const conn = db.select('*').from(process.env.TEST_TABLE);

const rows = db
	.select('*')
	.from(process.env.TEST_TABLE)
	.then(result => {
		console.log('rows = ', result);
	});

console.log(qry);
console.log(conn.client.connectionSettings);
console.log('----------------');

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
