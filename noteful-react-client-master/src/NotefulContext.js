import React from 'react';

// nothing else needs to be here because the context is defined in App.js,as contextObj - THIS IS ONLY TRUE IF NOT RUNNING TESTS

// IF RUNNING TESTS then need to copy over references to objects and methods:
const NotefulContext = React.createContext({
	folders: [],
	notes: [],
	deleteNote: () => {},
	addNote: () => {},
	addFolder: () => {},
	addErrorNotes: () => {},
	addErrorFolders: () => {},
	notesError: () => {},
	updateFolders: () => {},
	updateNotes: () => {},
	handleClickDeleteFolder: () => {}
});

export default NotefulContext;
