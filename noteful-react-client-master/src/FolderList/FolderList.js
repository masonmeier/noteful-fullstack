import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import FolderError from './FolderError';
import NotefulContext from '../NotefulContext';
import config from '../config';

const FolderList = props => {
	const contextType = useContext(NotefulContext);
	const { notes, folders, handleClickDeleteFolder } = contextType;

	let folderId;
	if (config.DATASOURCE === 'postgresql') {
		folderId = parseInt(props.match.params.id_folder);
	} else {
		folderId = props.match.params.id_folder;
	}

	return (
		<>
			<header>
				<>
					<h2>Folders</h2>
					&nbsp;&nbsp;
					<NavLink to={'/add-folder'}>
						<button className="btn-add">+</button>
					</NavLink>
					&nbsp;&nbsp;
					{props.match.params.id_folder !== undefined ? (
						<>
							<NavLink to={`/edit-folder/${props.match.params.id_folder}`}>
								<button className="btn-edit">&#9998;</button>
							</NavLink>
							&nbsp;&nbsp;
							<button
								className="btn-delete"
								onClick={() => handleClickDeleteFolder(folderId, props)}
							>
								-
							</button>
						</>
					) : null}
				</>
			</header>
			<ul>
				{folders.map(folder => (
					<li
						key={folder.id}
						className={folder.id === folderId ? ' active' : null}
					>
						<FolderError>
							<NavLink to={`/folders/${folder.id}`}>
								<span role="img" aria-label="Folder">
									&#x1F4C2;
								</span>
								&nbsp;{folder.name}&nbsp;(
								{notes.filter(note => note.id_folder === folder.id).length})
							</NavLink>
						</FolderError>
					</li>
				))}
			</ul>
		</>
	);
};

export default FolderList;

// to catch bugs
// check that get a folders array that has id and name
// this array is the "folders" variable coming from context
FolderList.propTypes = {
	folders: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		})
	)
};
