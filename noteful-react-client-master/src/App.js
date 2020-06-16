import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import config from './config';

// when using dummyStore text datafile:
// import dummyStore from './dummy-store';

// using React.Context:
import NotefulContext from './NotefulContext';

import Header from './Header/Header';

import FolderList from './FolderList/FolderList';
import FolderItem from './FolderItem/FolderItem';
import NoteList from './NoteList/NoteList';
import Note from './Note/Note';

import AddFolder from './AddFolder/AddFolder';
import AddNote from './AddNote/AddNote';

import EditFolder from './EditFolder/EditFolder';
import EditNote from './EditNote/EditNote';
import {createApiUrl} from './utils/api';

const routes = [
	{
		path: '/',
		exact: true,
		header: Header,
		aside: FolderList,
		section: NoteList
	},
	{
		path: '/folders/:id_folder',
		exact: true,
		header: Header,
		aside: FolderList,
		section: NoteList
	},
	{
		path: '/notes/:noteId',
		exact: true,
		header: Header,
		aside: FolderItem,
		section: Note
	},
	{
		path: '/add-folder',
		exact: true,
		header: Header,
		aside: null,
		section: AddFolder
	},
	{
		path: '/add-note',
		exact: true,
		header: Header,
		aside: null,
		section: AddNote
	},
	{
		path: '/edit-note/:noteId',
		exact: true,
		header: Header,
		aside: null,
		section: EditNote
	},
	{
		path: '/edit-folder/:id_folder',
		exact: true,
		header: Header,
		aside: null,
		section: EditFolder
	},
	{
		path: '/delete-folder/:id_folder',
		exact: true,
		header: Header,
		aside: FolderList,
		section: NoteList
	},
	{
		path: '/:any/:any/:any',
		exact: true,
		header: Header,
		aside: () => null,
		section: () => 'Do not edit the  url!'
	}
];

class App extends React.Component {
	// set default state variable values with hooks
	// const [folders, setFolders] = useState([]);
	// const [notes, setNotes] = useState([]);
	// const [foldersError, setFoldersError] = useState(null);
	// const [notesError, setNotesError] = useState(null);

	state = {
		folders: [],
		notes: [],
		foldersError: null,
		notesError: null,
		deleteFolderId: null
	};

	// to see foldersError in ui:
	// const [foldersError, setFoldersError] = useState({ value: 'foldersAPI errorMessage' });

	// to see notesError in ui:
	// const [notesError, setNotesError] = useState({value: 'notesAPI errorMessage'});

	// deleteNotes updates state
	// and inside render context is updated with values from state
	// then context is used to display values in FolderList and NoteList
	/*
    After making successful a DELETE API request, you can use a this.state.notes.filter method along with setState to remove a note from state and update context.
    */
	deleteNote = noteId => {
		const newNotes = this.state.notes.filter(note => note.id !== noteId);
		this.setState({ notes: newNotes });
	};

	deleteFolder = id_folder => {
		const newFolders = this.state.folders.filter(
			folder => folder.id !== id_folder
		);
		this.setState({ folders: newFolders });

		// deleting a folder cascade deletes notes in the database
		// so need to update notes array in state
		this.getNotes();
	};

	addNote = note => {
		this.setState({ notes: [...this.state.notes, note] });
	};

	addFolder = folder => {
		this.setState({ folders: [...this.state.folders, folder] });
	};

	addErrorNotes = error => {
		this.setState({ notesError: error });
	};

	addErrorFolders = error => {
		this.setState({ foldersError: error });
	};

	/*
    // NOTE NOTE NOTE
    // Pattern: every route is responsible for loading the data it needs from scratch

    // So the component rendering the /detail/:id route needs to fetch data for itself, including the correct id to use from the url, via the props React Router provides.
    */

	setFolders = folders => {
		this.setState({
			folders,
			error: null
		});
	};
	setNotes = notes => {
		this.setState({
			notes,
			error: null
		});
	};

	getFolders = () => {
		fetch(createApiUrl('/folders'), {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(res.status);
				}
				return res.json();
			})
			.then(this.setFolders)
			// passes res to setFolders function
			// shortcut which equals .then(res => this.setFolders(res))
			.catch(error => this.setState({ foldersError: error }));
	};

	getNotes = () => {
		fetch(createApiUrl('/notes'), {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(res.status);
				}
				return res.json();
			})
			.then(this.setNotes)
			// passes res to setNotes function
			// shortcut which equals .then(res => this.setNotes(res))
			.catch(error => this.setState({ notesError: error }));
	};

	componentDidMount() {
		this.getFolders();
		this.getNotes();
	}

	updateFolders = updatedFolder => {
		const newFolders = this.state.folders.map(folder =>
			folder.id !== updatedFolder.id ? folder : updatedFolder
		);

		this.setState({ folders: newFolders });
	};

	updateNotes = updatedNote => {
		const newNotes = this.state.notes.map(note =>
			note.id !== updatedNote.id ? note : updatedNote
		);

		this.setState({ notes: newNotes });
	};

	handleClickDeleteFolder = (id_folder, props) => {
		fetch(createApiUrl(`/folders/${id_folder}`), {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				// I think b/c cors, typecode gives a res.status = 404 and an EMPTY error object when try to delete note so,

				if (!res.ok || res.status === '404') {
					// get the error message from the response,
					return res.json().then(error => {
						// then throw it
						// throw res.status instead of error b/c error is an empty object
						throw res.status;
					});
				}
				return res.json();
			})
			.then(data => {
				// call the callback function when the request is successful
				// this is where the App component can remove it from state
				// ie. update the folders stored in state
				// which also updates the folders stored in context
				this.deleteFolder(id_folder);

				// remove id_folder from URL
				props.history.push(`/`);
			})
			.catch(error => {
				// WORKAROUND to handle EMPTY error object and res.status = 404
				if (error !== 404) {
					this.addErrorFolders(error);
				}

				if (error === 404) {
					this.deleteFolder(id_folder);

					// remove id_folder from URL
					props.history.push(`/`);
				}
			});
	};

	render() {
		// create object to update the values stored in NotefulContext
		const contextObj = {
			notes: this.state.notes,
			folders: this.state.folders,
			deleteNote: this.deleteNote,
			addNote: this.addNote,
			addFolder: this.addFolder,
			addErrorNotes: this.addErrorNotes,
			addErrorFolders: this.addErrorFolders,
			notesError: this.notesError,
			updateFolders: this.updateFolders,
			updateNotes: this.updateNotes,
			handleClickDeleteFolder: this.handleClickDeleteFolder
		};
		return (
			<>
				<Header />
				{/* actually update the values stored in NotefulContext by passing contextObj into value

                Use the Provider to make values available to all children/grandchildren/subcomponents

                See: https://reactjs.org/docs/context.html#caveats

                -- the code below will re-render all consumers every time the Provider re-renders because a new object is always created for value
                */}
				<NotefulContext.Provider value={contextObj}>
					<main>
						<div className="aside">
							{this.state.foldersError && (
								<p className="error">{this.state.foldersError.value}</p>
							)}
							{routes.map(({ path, exact, aside: A }) => (
								<Route key={path} path={path} exact={exact} component={A} />
							))}
						</div>
						<article>
							{/* NOTE:
                         CAN use render props to pass unfinishedMessage prop via route
                         AND
                         to pass location, match and history props to the component so that in the component I have access to the history object to push a new location into

                                    render={props => (
                                        <S
                                        {...props}
                                        unfinishedMessage={unfinishedMessage} />
                                    )}

                        can also pass unfinishedMessage via Context and do:
                        component={S}

						---- ALTERNATIVE:

						{routes.map(({ path, exact, section: S }) => (
							<Route
								key={path}
								path={path}
								exact={exact}
								render={props => <S {...props} />}
							/>
						))}

                        */}

							{this.state.notesError && (
								<p className="error">{this.state.notesError.value}</p>
							)}

							{routes.map(({ path, exact, section: S }) => (
								<Route key={path} path={path} exact={exact} component={S} />
							))}
						</article>
					</main>
				</NotefulContext.Provider>

			</>
		);
	}
}

export default App;
