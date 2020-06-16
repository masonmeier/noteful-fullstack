import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import NotefulContext from '../NotefulContext';
import config from '../config';

const FolderItem = props => {
	const context = useContext(NotefulContext);
	const { folders, notes } = context;

	let noteId;

	// use the selected noteId to
	// - use the notes object & get the id_folder
	// - from the folders object, use the id_folder to get the note's parent folder

	if (config.DATASOURCE === 'postgresql') {
		noteId = parseInt(props.match.params.noteId);
	} else {
		noteId = props.match.params.noteId;
	}

	const activeNote = notes ? notes.find(note => note.id === noteId) : '';

	if (!activeNote) return 'Sorry, no note found.';

	const id_folder = activeNote.id_folder;
	const activeFolder = folders.filter(folder => folder.id === id_folder);

	return (
		<>
			{!activeFolder
				? null
				: activeFolder.map(folder => (
						<header key={folder.id}>
							<h2>
								{folder.name}
								<br />
								<NavLink to={`/edit-folder/${folder.id}`}>
									<button className="btn-edit">&#9998;</button>
								</NavLink>
								<br />
								<button className="btn-save" onClick={props.history.goBack}>
									Go Back
								</button>
							</h2>
						</header>
				  ))}
		</>
	);
};

export default FolderItem;

// to catch bugs
// check that get a folders array that has id and name
// this array is the "folders" variable coming from context
// AND
// check that get a notes array that has id, name, and modified
// this array is the "notes" variable coming from context
FolderItem.propTypes = {
	folders: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		})
	),
	notes: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			modified: PropTypes.instanceOf(Date).isRequired
		})
	)
};
