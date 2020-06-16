import React from 'react';
import ReactDOM from 'react-dom';
import EditNote from './EditNote';

it('renders without crashing', () => {
	const div = document.createElement('div');

	const props = {
		location: {
			state: {
				id_folder: 99
			}
		},
		match: {
			params: 1 // noteId
		},
		history: {
			push: () => {}
		}
	};
	ReactDOM.render(<EditNote {...props} />, div);
	ReactDOM.unmountComponentAtNode(div);
});
