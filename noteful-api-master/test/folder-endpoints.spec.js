const knex = require('knex');
const app = require('../src/app');
const { makeFolderArray, makeMaliciousFolder } = require('./folder-fixtures');

describe('Folder Endpoints', function() {
	let db;

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('clean the table', () =>
		db.raw('TRUNCATE note, folder RESTART IDENTITY CASCADE')
	);

	afterEach('cleanup', () =>
		db.raw('TRUNCATE note, folder RESTART IDENTITY CASCADE')
	);

	describe(`Unauthorized requests`, () => {
		const testFolder = makeFolderArray();

		beforeEach('insert folder', () => {
			return db.into('folder').insert(testFolder);
		});

		it(`responds with 401 Unauthorized for GET /api/folders`, () => {
			return supertest(app)
				.get('/api/folders')
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for POST /api/folders`, () => {
			return supertest(app)
				.post('/api/folders')
				.send({
					name: 'test folder name'
				})
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for GET /api/folders/:id`, () => {
			const item = testFolder[1];
			return supertest(app)
				.get(`/api/folders/${item.id}`)
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for DELETE /api/folders/:id`, () => {
			const item = testFolder[1];
			return supertest(app)
				.delete(`/api/folders/${item.id}`)
				.expect(401, { error: 'Unauthorized request' });
		});
	});

	// ************************

	describe(`GET /api/folders`, () => {
		context(`Given no folders`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get('/api/folders')
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200, []);
			});
		});

		context('Given there are folders in the database', () => {
			const testFolder = makeFolderArray();

			beforeEach('insert folders', () => {
				return db.into('folder').insert(testFolder);
			});

			it('responds with 200 and all of the folders', () => {
				return supertest(app)
					.get('/api/folders')
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200, testFolder);
			});
		});

		context(`Given an XSS attack folder name`, () => {
			const { maliciousFolder, expectedFolder } = makeMaliciousFolder();

			beforeEach('insert malicious folder name', () => {
				return db.into('folder').insert(maliciousFolder);
			});

			it('removes XSS attack folder name', () => {
				return supertest(app)
					.get(`/api/folders`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200)
					.expect(res => {
						expect(res.body[0].name).to.eql(expectedFolder.name);
					});
			});
		});
	});

	describe(`GET /api/folders/:folder_id`, () => {
		context(`Given no folder`, () => {
			it(`responds with 404`, () => {
				const id_folder = 123456;
				return supertest(app)
					.get(`/api/folders/${id_folder}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Folder Not Found` } });
			});
		});

		context('Given there are folders in the database', () => {
			const testFolder = makeFolderArray();

			beforeEach('insert folder', () => {
				return db.into('folder').insert(testFolder);
			});

			it('responds with 200 and the specified folder', () => {
				const id_folder = 2;
				const expectedFolder = testFolder[id_folder - 1];
				return supertest(app)
					.get(`/api/folders/${id_folder}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200, expectedFolder);
			});
		});

		context(`Given an XSS attack folder`, () => {
			const testFolder = makeFolderArray();
			const { maliciousFolder, expectedFolder } = makeMaliciousFolder();

			beforeEach('insert malicious folder', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('folder').insert([maliciousFolder]);
					});
			});

			it('removes XSS attack content', () => {
				return supertest(app)
					.get(`/api/folders/${maliciousFolder.id}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200)
					.expect(res => {
						expect(res.body.name).to.eql(expectedFolder.name);
					});
			});
		});
	});

	describe(`POST /api/folders`, () => {
		const testFolder = makeFolderArray();

		// DISCUSS WITH MENTOR
		// TESTS PASS WHEN I COMMENT THIS OUT
		// BUT THIS IS CODE FROM Blogful !!!

		// beforeEach('insert malicious folder', () => {
		// 	return db.into('folder').insert(testFolder);
		// });

		it(`creates a folder, responding with 201 and the new folder`, () => {
			const newFolder = {
				name: 'Test New Folder'
			};
			return supertest(app)
				.post('/api/folders')
				.send(newFolder)
				.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
				.expect(201)
				.expect(res => {
					expect(res.body.name).to.eql(newFolder.name);
					expect(res.body).to.have.property('id');
					expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`);
				})
				.then(res =>
					supertest(app)
						.get(`/api/folders/${res.body.id}`)
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res.body)
				);
		});

		const requiredFields = ['name'];

		requiredFields.forEach(field => {
			const newFolder = {
				name: 'Test New Folder'
			};

			it(`responds with 400 and an error message when the '${field}' is missing`, () => {
				delete newFolder[field];

				return supertest(app)
					.post('/api/folders')
					.send(newFolder)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(400, {
						error: { message: `'${field}' is required` }
					});
			});
		});

		it('removes XSS attack content from response', () => {
			const { maliciousFolder, expectedFolder } = makeMaliciousFolder();
			return supertest(app)
				.post(`/api/folders`)
				.send(maliciousFolder)
				.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
				.expect(201)
				.expect(res => {
					expect(res.body.name).to.eql(expectedFolder.name);
				});
		});
	});

	describe(`DELETE /api/folders/:folder_id`, () => {
		context(`Given no folder`, () => {
			it(`responds with 404`, () => {
				const id_folder = 123456;
				return supertest(app)
					.delete(`/api/folders/${id_folder}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Folder Not Found` } });
			});
		});

		context('Given there are folders in the database', () => {
			const testFolder = makeFolderArray();

			beforeEach('insert folder', () => {
				return db.into('folder').insert(testFolder);
			});

			it('responds with 204 and removes the folder', () => {
				const idToRemove = 2;
				const expectedFolder = testFolder.filter(
					folder => folder.id !== idToRemove
				);
				return supertest(app)
					.delete(`/api/folders/${idToRemove}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(res =>
						supertest(app)
							.get(`/api/folders`)
							.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
							.expect(expectedFolder)
					);
			});
		});
	});

	describe(`PATCH /api/folders/:folder_id`, () => {
		context(`Given no folder`, () => {
			it(`responds with 404`, () => {
				const id_folder = 123456;
				return supertest(app)
					.delete(`/api/folders/${id_folder}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Folder Not Found` } });
			});
		});

		context('Given there are folders in the database', () => {
			const testFolder = makeFolderArray();

			beforeEach('insert folder', () => {
				return db.into('folder').insert(testFolder);
			});

			it('responds with 204 and updates the folder', () => {
				const idToUpdate = 2;
				const updateFolder = {
					name: 'updated folder name'
				};
				const expectedFolder = {
					...testFolder[idToUpdate - 1],
					...updateFolder
				};
				return supertest(app)
					.patch(`/api/folders/${idToUpdate}`)
					.send(updateFolder)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(res =>
						supertest(app)
							.get(`/api/folders/${idToUpdate}`)
							.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
							.expect(expectedFolder)
					);
			});

			it(`responds with 400 when no required fields supplied`, () => {
				const idToUpdate = 2;
				return supertest(app)
					.patch(`/api/folders/${idToUpdate}`)
					.send({ irrelevantField: 'foo' })
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(400, {
						error: {
							message: `Update must contain folder name`
						}
					});
			});

			it(`responds with 204 when updating only a subset of fields`, () => {
				const idToUpdate = 2;
				const updateFolder = {
					name: 'updated folder name'
				};
				const expectedFolder = {
					...testFolder[idToUpdate - 1],
					...updateFolder
				};

				return supertest(app)
					.patch(`/api/folders/${idToUpdate}`)
					.send({
						...updateFolder,
						fieldToIgnore: 'should not be in GET response'
					})
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(res =>
						supertest(app)
							.get(`/api/folders/${idToUpdate}`)
							.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
							.expect(expectedFolder)
					);
			});
		});
	});
});
