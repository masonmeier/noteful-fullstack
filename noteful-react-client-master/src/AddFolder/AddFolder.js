import React from 'react';
import config from '../config';

import NotefulContext from '../NotefulContext';

import ValidationError from '../ValidationError';

class AddFolder extends React.Component {
	static contextType = NotefulContext;

	state = {
		apiError: null,
		formValid: false,
		errorCount: null,
		name: '',
		errors: {
			name: 'You must enter a folder name'
		}
	};

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

	handleSubmit = e => {
		e.preventDefault();

		// do NOT submit form if any errors
		if (this.state.errorCount > 0) return;

		// get the form fields from the event
		const { name } = e.target;
		const folder = {
			name: name.value
		};
		this.setState({ apiError: null });

		fetch(config.FOLDERS_ENDPOINT, {
			method: 'POST',
			body: JSON.stringify(folder),
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) {
					// get the error message from the response,
					return res.json().then(error => {
						// then throw it
						throw error;
					});
				}
				return res.json();
			})
			.then(data => {
				// clear form values
				name.value = '';

				this.context.addFolder(data);

				// select newly created folder:
				this.props.history.push(`/folders/${data.id}`);
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
			<form className="addFolderForm" onSubmit={this.handleSubmit} noValidate>
				<fieldset>
					<legend>New Folder</legend>
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
					</button>
				</fieldset>

				{this.state.errorCount !== null ? (
					<p className="form-status">
						Form is {this.state.formValid ? 'complete  ✅' : 'incomplete  ❌'}
					</p>
				) : null}
			</form>
		);
	}
}

export default AddFolder;
