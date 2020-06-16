function makeNoteArray() {
	return [
		{
			id: 1,
			name: 'Dogs',
			id_folder: 1,
			content: 'Note 1',
			modified: '2029-01-22T16:28:32.615Z'
		},
		{
			id: 2,
			name: 'Cats',
			id_folder: 1,
			content: 'Note 2',
			modified: '2100-05-23T04:28:32.615Z'
		}
	];
}

function makeMaliciousNote() {
	const maliciousNote = {
		id: 911,
		name: 'MaliciousNote',
		id_folder: 1,
		content: 'Naughty naughty very naughty <script>alert("xss");</script>'
	};

	const expectedNote = {
		...maliciousNote,
		content:
			'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
		description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
	};
	return {
		maliciousNote,
		expectedNote
	};
}

module.exports = {
	makeNoteArray,
	makeMaliciousNote
};
