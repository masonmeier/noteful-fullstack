function makeFolderArray() {
	return [
		{
			id: 1,
			name: 'Important'
		},
		{
			id: 2,
			name: 'Super'
		},
		{
			id: 3,
			name: 'Spangley'
		}
	];
}

function makeMaliciousFolder() {
	const maliciousFolder = {
		id: 911,
		name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
	};

	const expectedFolder = {
		...maliciousFolder,
		name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
	};
	return {
		maliciousFolder,
		expectedFolder
	};
}

module.exports = {
	makeFolderArray,
	makeMaliciousFolder
};
