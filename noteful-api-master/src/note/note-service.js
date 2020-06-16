// methods to store database transactions
let table = 'note';

const NoteService = {
	getAllNotes(knex) {
		return knex.select('*').from(table);
	},
	insertNote(knex, newNote) {
		return knex
			.insert(newNote)
			.into(table)
			.returning('*')
			.then(rows => {
				return rows[0];
			});
	},
	getById(knex, id) {
		return knex
			.from(table)
			.select('*')
			.where('id', id)
			.first();
	},
	deleteNote(knex, id) {
		return knex(table)
			.where({ id })
			.delete();
	},
	updateNote(knex, id, newNoteFields) {
		return knex(table)
			.where({ id })
			.update(newNoteFields);
	}
};

module.exports = NoteService;
