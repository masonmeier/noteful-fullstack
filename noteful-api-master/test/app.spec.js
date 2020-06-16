const app = require('../src/app');

describe(`App Server endpoints - Unauthorized requests`, () => {
	it(`responds with 401 Unauthorized for GET /`, () => {
		return supertest(app)
			.get('/')
			.expect(401, { error: 'Unauthorized request' });
	});
});

describe('App Server endpoints - Authorized requests', () => {
	it('GET / responds with 200 containing "Hello, world!"', () => {
		return supertest(app)
			.get('/')
			.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
			.expect(200, 'Hello, world!');
	});
});
