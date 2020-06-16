import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import NoteItem from '../NoteItem/NoteItem';

import NotefulContext from '../NotefulContext';
import config from '../config';

const Note = props => {
	// need to grab NotefulContext (globals)
	const context = useContext(NotefulContext);
	const { notes } = context;
	let noteId;

	// NOTE
	// reloading the browser wipes the context from memory
	// so need to handle if user reloads the browser and its undefined
	// done by adding || {} here AND : '' for props.modified in NoteItem too

	if (config.DATASOURCE === 'postgresql') {
		noteId = parseInt(props.match.params.noteId);
	} else {
		noteId = props.match.params.noteId;
	}

	const note = notes.find(note => note.id === noteId) || {};

	return (
		<section>
			<div className="note">
				<NoteItem {...props} note={note} />
				<p className="note-content">{note.content}</p>
			</div>
		</section>
	);
};

export default Note;

// to catch bugs
// check that get a notes array that has id, name, content, and modified
// this array is the "notes" variable coming from context
Note.propTypes = {
	notes: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			id_folder: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
			modified: PropTypes.instanceOf(Date).isRequired
		})
	)
};
