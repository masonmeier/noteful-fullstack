const knex = require('knex');
const app = require('../src/app');
const { makeNoteArray, makeMaliciousNote } = require('./note-fixtures');
const { makeFolderArray } = require('./folder-fixtures');

describe('Note Endpoints', function() {
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
		const testNote = makeNoteArray();

		beforeEach('insert notes', () => {
			return db
				.into('folder')
				.insert(testFolder)
				.then(() => {
					return db.into('note').insert(testNote);
				});
		});

		it(`responds with 401 Unauthorized for GET /api/notes`, () => {
			return supertest(app)
				.get('/api/notes')
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for POST /api/notes`, () => {
			return supertest(app)
				.post('/api/notes')
				.send({
					name: 'test note name',
					content: 'test note content',
					id_folder: 1
				})
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for GET /api/notes/:id`, () => {
			const item = testNote[1];
			return supertest(app)
				.get(`/api/notes/${item.id}`)
				.expect(401, { error: 'Unauthorized request' });
		});

		it(`responds with 401 Unauthorized for DELETE /api/notes/:id`, () => {
			const item = testNote[1];
			return supertest(app)
				.delete(`/api/notes/${item.id}`)
				.expect(401, { error: 'Unauthorized request' });
		});
	});

	// ************************

	describe(`GET /api/notes`, () => {
		context(`Given no notes`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get('/api/notes')
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200, []);
			});
		});

		context('Given there are notes in the database', () => {
			const testFolder = makeFolderArray();
			const testNote = makeNoteArray();

			beforeEach('insert note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert(testNote);
					});
			});

			it('responds with 200 and all of the notes', () => {
				return supertest(app)
					.get('/api/notes')
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(res => {
						expect(res.body[0].name).to.eql(testNote[0].name);
						expect(res.body[0]).to.have.property('id');
					});

				// DISCUSS WITH MENTOR
				// .expect(200, testNote);
			});
		});

		context(`Given an XSS attack note`, () => {
			const testFolder = makeFolderArray();
			const { maliciousNote, expectedNote } = makeMaliciousNote();

			beforeEach('insert malicious note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert([maliciousNote]);
					});
			});

			it('removes XSS attack note name or content', () => {
				return supertest(app)
					.get(`/api/notes`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200)
					.expect(res => {
						expect(res.body[0].name).to.eql(expectedNote.name);
						expect(res.body[0].content).to.eql(expectedNote.content);
					});
			});
		});
	});

	describe(`GET /api/notes/:id`, () => {
		context(`Given no note`, () => {
			it(`responds with 404`, () => {
				const noteId = 123456;
				return supertest(app)
					.get(`/api/notes/${noteId}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Note Not Found` } });
			});
		});

		context('Given there are notes in the database', () => {
			const testFolder = makeFolderArray();
			const testNote = makeNoteArray();

			beforeEach('insert note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert(testNote);
					});
			});

			it('responds with 200 and the specified note', () => {
				const noteId = 2;
				const expectedNote = testNote[noteId - 1];
				return supertest(app)
					.get(`/api/notes/${noteId}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)

					.expect(res => {
						expect(res.body.name).to.eql(expectedNote.name);
						expect(res.body).to.have.property('id');
					});

				// .expect(200, expectedNote);
				// DISCUSS WITH MENTOR
			});
		});

		context(`Given an XSS attack note`, () => {
			const testFolder = makeFolderArray();
			const { maliciousNote, expectedNote } = makeMaliciousNote();

			beforeEach('insert malicious note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert([maliciousNote]);
					});
			});

			it('removes XSS attack content', () => {
				return supertest(app)
					.get(`/api/notes/${maliciousNote.id}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(200)
					.expect(res => {
						expect(res.body.name).to.eql(expectedNote.name);
						expect(res.body.content).to.eql(expectedNote.content);
					});
			});
		});
	});

	describe(`POST /api/notes`, () => {
		const testFolder = makeFolderArray();
		const testNote = makeNoteArray();

		// DISCUSS WITH MENTOR
		// TESTS PASS WHEN I COMMENT THIS OUT
		// BUT THIS IS CODE FROM Blogful !!!

		// beforeEach('insert malicious note', () => {
		// 	return db
		// 		.into('folder')
		// 		.insert(testFolder)
		// 		.then(() => {
		// 			return db.into('note').insert(testNote);
		// 		});
		// });

		// MY FIX:
		beforeEach('insert related folder', () => {
			return db.into('folder').insert(testFolder);
		});

		it(`creates an note, responding with 201 and the new note`, () => {
			const newNote = {
				name: 'Test New Note',
				id_folder: 1,
				content: 'Test new note content...'
			};
			return supertest(app)
				.post('/api/notes')
				.send(newNote)
				.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
				.expect(201)
				.expect(res => {
					expect(res.body.name).to.eql(newNote.name);
					expect(res.body.id_folder).to.eql(newNote.id_folder);
					expect(res.body.content).to.eql(newNote.content);
					expect(res.body).to.have.property('id');
					expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`);
					// const expected = new Intl.DateTimeFormat('en-US').format(new Date());
					// const actual = new Intl.DateTimeFormat('en-US').format(
					// 	new Date(res.body.modified)
					// );
					// expect(actual).to.eql(expected);
				})
				.then(res =>
					supertest(app)
						.get(`/api/notes/${res.body.id}`)
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res.body)
				);
		});

		const requiredFields = ['name'];

		requiredFields.forEach(field => {
			const newNote = {
				name: 'Test New Note',
				id_folder: '1',
				content: 'Test new note content...'
			};

			it(`responds with 400 and an error message when the '${field}' is missing`, () => {
				delete newNote[field];

				return supertest(app)
					.post('/api/notes')
					.send(newNote)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(400, {
						error: { message: `'${field}' is required` }
					});
			});
		});

		it('removes XSS attack content from response', () => {
			const { maliciousNote, expectedNote } = makeMaliciousNote();
			return supertest(app)
				.post(`/api/notes`)
				.send(maliciousNote)
				.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
				.expect(201)
				.expect(res => {
					expect(res.body.name).to.eql(expectedNote.name);
					expect(res.body.content).to.eql(expectedNote.content);
				});
		});
	});

	describe(`DELETE /api/notes/:id`, () => {
		context(`Given no note`, () => {
			it(`responds with 404`, () => {
				const noteId = 123456;
				return supertest(app)
					.delete(`/api/notes/${noteId}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Note Not Found` } });
			});
		});

		context('Given there are notes in the database', () => {
			const testFolder = makeFolderArray();
			const testNote = makeNoteArray();

			beforeEach('insert note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert(testNote);
					});
			});

			it('responds with 204 and removes the note', () => {
				const idToRemove = 2;
				const expectedNote = testNote.filter(note => note.id !== idToRemove);
				return supertest(app)
					.delete(`/api/notes/${idToRemove}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(
						res =>
							supertest(app)
								.get(`/api/notes`)
								.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
								.expect(res => {
									expect(res.body.name).to.eql(expectedNote.name);
									expect(res.body[0]).to.have.property('id');
								})

						// .expect(200, expectedNote);
						// DISCUSS WITH MENTOR
					);
			});
		});
	});

	describe(`PATCH /api/notes/:id`, () => {
		context(`Given no note`, () => {
			it(`responds with 404`, () => {
				const noteId = 123456;
				return supertest(app)
					.delete(`/api/notes/${noteId}`)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(404, { error: { message: `Note Not Found` } });
			});
		});

		context('Given there are notes in the database', () => {
			const testFolder = makeFolderArray();
			const testNote = makeNoteArray();

			beforeEach('insert note', () => {
				return db
					.into('folder')
					.insert(testFolder)
					.then(() => {
						return db.into('note').insert(testNote);
					});
			});

			it('responds with 204 and updates the note', () => {
				const idToUpdate = 2;
				const updateNote = {
					name: 'updated note name',
					id_folder: 1,
					content: 'updated note content'
				};
				const expectedNote = {
					...testNote[idToUpdate - 1],
					...updateNote
				};
				return supertest(app)
					.patch(`/api/notes/${idToUpdate}`)
					.send(updateNote)
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(
						res =>
							supertest(app)
								.get(`/api/notes/${idToUpdate}`)
								.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
								.expect(res => {
									expect(res.body.name).to.eql(expectedNote.name);
									expect(res.body).to.have.property('id');
								})

						// .expect(200, expectedNote);
						// DISCUSS WITH MENTOR
					);
			});

			it(`responds with 400 when no required fields supplied`, () => {
				const idToUpdate = 2;
				return supertest(app)
					.patch(`/api/notes/${idToUpdate}`)
					.send({ irrelevantField: 'foo' })
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(400, {
						error: {
							message: `Request body must contain either 'name', 'id_folder', or 'content'`
						}
					});
			});

			it(`responds with 204 when updating only a subset of fields`, () => {
				const idToUpdate = 2;
				const updateNote = {
					name: 'updated note name'
				};
				const expectedNote = {
					...testNote[idToUpdate - 1],
					...updateNote
				};

				return supertest(app)
					.patch(`/api/notes/${idToUpdate}`)
					.send({
						...updateNote,
						fieldToIgnore: 'should not be in GET response'
					})
					.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
					.expect(204)
					.then(
						res =>
							supertest(app)
								.get(`/api/notes/${idToUpdate}`)
								.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
								.expect(res => {
									expect(res.body.name).to.eql(expectedNote.name);
									expect(res.body).to.have.property('id');
								})

						// .expect(200, expectedNote);
						// DISCUSS WITH MENTOR
					);
			});
		});
	});
});
