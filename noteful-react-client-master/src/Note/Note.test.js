import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Note from './Note';

describe(`Note component`, () => {
	const props = {
		match: {
			params: {
				noteId: '1'
			}
		},
		notes: [
			{
				id: '1',
				id_folder: '101',
				name: 'test-note-title',
				content: 'test-note-content',
				modified: new Date(2019, 8, 30)
			}
		]
	};

	it('renders a Note by default', () => {
		const wrapper = shallow(<Note {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('renders the Note given props', () => {
		const wrapper = shallow(<Note {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});
});
