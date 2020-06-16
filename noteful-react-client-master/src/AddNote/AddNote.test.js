import React from 'react';
import ReactDOM from 'react-dom';
import AddNote from './AddNote';

it('renders without crashing', () => {
	const div = document.createElement('div');

	const props = {
		name: 'test-folder',
		content: 'note content',
		modified: new Date(),
		location: {
			state: {
				id_folder: 99
			}
		},
		history: {
			push: () => {}
		}
	};
	ReactDOM.render(<AddNote {...props} />, div);
	ReactDOM.unmountComponentAtNode(div);
});
