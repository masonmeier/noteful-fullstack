import React from 'react';
import config from '../config';

import NotefulContext from '../NotefulContext';

import ValidationError from '../ValidationError';

class EditFolder extends React.Component {
	static contextType = NotefulContext;

	state = {
		apiError: null,
		formValid: true,
		errorCount: null,
		id: this.props.match.params.id_folder,
		name: '',
		errors: {
			name: ''
		}
	};

	// get folder to be updated
	componentDidMount() {
		const { id_folder } = this.props.match.params;
		fetch(config.FOLDERS_ENDPOINT + `/${id_folder}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) return res.json().then(error => Promise.reject(error));

				return res.json();
			})
			.then(responseData => {
				this.setState({
					id: responseData.id,
					name: responseData.name
				});
			})
			.catch(error => {
				this.setState({ apiError: error });
			});
	}

	updateErrorCount = () => {
		let errors = this.state.errors;
		let count = 0;

		Object.values(errors).forEach(val => {
			if (val.length > 0) {
				count++;
			}
		});

		this.setState({ errorCount: count });
		let valid = count === 0 ? true : false;
		this.setState({ formValid: valid });
	};

	validateField = (name, value) => {
		let err = '';

		if (name === 'name') {
			if (value.trim().length === 0) {
				err = 'Folder name is required';
			} else if (value.trim().length < 3) {
				err = 'Folder name must be at least 3 characters long';
			}
		}
		const { errors } = { ...this.state };
		errors[name] = err;
		this.setState({ errors });
	};

	handleChange = event => {
		const { name, value } = event.target;
		this.setState({ [name]: value.trim() });

		this.validateField(name, value);
		this.updateErrorCount();
	};

	handleClickCancel = () => {
		this.props.history.push('/');
	};

	resetFields = newFields => {
		this.setState({
			id: newFields.id || '',
			name: newFields.name || ''
		});
	};

	handleSubmit = e => {
		e.preventDefault();

		// do NOT submit form if any errors
		if (this.state.errorCount > 0) return;

		// get the form fields from the event
		const { id_folder } = this.props.match.params;
		const { id, name } = this.state;
		const newFolder = { id, name };

		this.setState({ apiError: null });

		fetch(config.FOLDERS_ENDPOINT + `/${id_folder}`, {
			method: 'PATCH',
			body: JSON.stringify(newFolder),
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) return res.json().then(error => Promise.reject(error));
			})
			.then(() => {
				this.resetFields(newFolder);
				this.context.updateFolders(newFolder);
				// return to list:
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({ apiError: error });
			});
	};

	render() {
		const { errors } = this.state;

		if (this.state.apiError) {
			return <p className="error">{this.state.apiError}</p>;
		}

		return (
			<>
				<form
					className="editFolderForm"
					onSubmit={this.handleSubmit}
					noValidate
				>
					<fieldset>
						<legend>Edit Folder</legend>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							aria-label="Folder Name"
							required
							aria-required="true"
							aria-describedby="folderNameError"
							aria-invalid="true"
							value={this.state.name}
							onChange={this.handleChange}
						/>
						{errors.name.length > 0 && (
							<ValidationError message={errors.name} id={'folderNameError'} />
						)}
						<br />
						<button className="btn-cancel" onClick={this.handleClickCancel}>
							Cancel
						</button>{' '}
						<button
							className="btn-save"
							disabled={this.state.formValid === false}
						>
							Save Folder
						</button>{' '}
						{/* <button
							className="btn-delete-folder"
							disabled={this.state.formValid === false}
							onClick={() =>
								this.context.handleClickDeleteFolder(this.state.id, this.props)
							}
						>
							Delete
						</button> */}
					</fieldset>
				</form>

				{this.state.formValid ? (
					<button
						className="btn-delete-folder btn-position"
						disabled={this.state.formValid === false}
						onClick={() =>
							this.context.handleClickDeleteFolder(this.state.id, this.props)
						}
					>
						Delete
					</button>
				) : null}

				{this.state.errorCount !== null ? (
					<p className="form-status">
						Form is {this.state.formValid ? 'complete  ✅' : 'incomplete  ❌'}
					</p>
				) : null}
			</>
		);
	}
}

export default EditFolder;
