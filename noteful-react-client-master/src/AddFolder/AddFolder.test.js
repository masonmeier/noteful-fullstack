import React from 'react';
import ReactDOM from 'react-dom';
import AddFolder from './AddFolder';

it('renders without crashing', () => {
	const div = document.createElement('div');
	const props = {
		name: 'test-folder',
		history: {
			push: () => {}
		}
	};
	ReactDOM.render(<AddFolder {...props} />, div);
	ReactDOM.unmountComponentAtNode(div);
});
