// methods to store database transactions
let table = 'folder';

const FolderService = {
	getAllFolders(knex) {
		return knex.select('*').from(table);
	},
	insertFolder(knex, newFolder) {
		return knex
			.insert(newFolder)
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
	deleteFolder(knex, id) {
		return knex(table)
			.where({ id })
			.delete();
	},
	updateFolder(knex, id, newFolderFields) {
		return knex(table)
			.where({ id })
			.update(newFolderFields);
	}
};

module.exports = FolderService;
