import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import config from '../config';
import NotefulContext from '../NotefulContext';

// this function 1st deletes via the API, then from state
// context.deleteNote = the update function, to update state in context
// Using a CLASS instead of a functional component I do *** NOT *** have to
//  pass in PROPS to get history, location and match (AND props.note.id) AND pass in CONTEXT for deleteNote function because there is no other way for the handleClickDelete function
// - to know what is in Context
// - to know history, location and match

export default class NoteItem extends React.Component {
	// need to grab NotefulContext (globals)
	static contextType = NotefulContext;

	handleClickDelete = e => {
		e.preventDefault();

		const noteId = this.props.note.id;

		fetch(config.NOTES_ENDPOINT + `/${noteId}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${config.API_KEY}`
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
				// ie. update the notes stored in state
				// which also updates the notes stored in context
				this.context.deleteNote(noteId);

				// if in Note detail, return to show all notes list
				if (this.props.location.pathname.includes('/notes/')) {
					this.props.history.push(`/`);
				}

				// if have selected a folder, need to refresh after delete a note
				if (this.props.location.pathname.includes('/folders/')) {
					this.props.history.push(this.props.location.pathname);
				}
			})
			.catch(error => {
				// WORKAROUND to handle EMPTY error object and res.status = 404
				if (error !== 404) {
					this.context.addErrorNotes(error);
				}

				if (error === 404) {
					this.context.deleteNote(noteId);

					// if in Note detail, return to show all notes list
					if (this.props.location.pathname.includes('/notes/')) {
						this.props.history.push(`/`);
					}

					// if have selected a folder, need to refresh after delete a note
					if (this.props.location.pathname.includes('/folders/')) {
						this.props.history.push(this.props.location.pathname);
					}
				}
			});
	};

	render() {
		// to see noteItem notesError in ui & trigger NoteError boundary:
		// this.context.addErrorNotes({ value: 'notesItemAPI errorMessage' });
		return (
			<div className="note-item">
				{this.context.notesError && (
					<p className="error">{this.context.notesError.value}</p>
				)}
				{/*
			THIS CAUSED A staticContent ERROR:
			<NavLink to={`/notes/${note.id}`} {...props}>
				<h3>{note.title}</h3>
			</NavLink> */}
				<NavLink
					to={{
						pathname: `/notes/${this.props.note.id}`,
						props: this.props
					}}
				>
					<h3>{this.props.note.name}</h3>
				</NavLink>
				<div className="button-container">
					<span>
						Modified on{' '}
						<span className="note-datemod">
							{' '}
							{this.props.note.modified
								? this.props.note.modified.toString().split('T', 1)[0]
								: ''}
						</span>
					</span>
					<span>
						<NavLink to={`/edit-note/${this.props.note.id}`}>
							<button className="btn-edit-note">&#9998;</button>
						</NavLink>
						&nbsp;&nbsp;&nbsp;
						<button
							className="btn-delete-note"
							onClick={this.handleClickDelete}
						>
							-
						</button>
					</span>
				</div>
			</div>
		);
	}
}

// to catch bugs
// check that get a notes array that has id, name, and modified
// this array is the "notes" variable coming from context
NoteItem.propTypes = {
	notes: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			modified: PropTypes.instanceOf(Date).isRequired
		})
	)
};

// default values
// ONLY for props that are NOT required
// so do NOT create NoteItem.defaultProps
// NoteItem.defaultProps = {
// 	note: {
// 		id: '',
// 		name: '',
// 		modified: ''
// 	}
// };
