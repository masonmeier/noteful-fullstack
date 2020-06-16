import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NoteList from './NoteList';

describe(`NoteList component`, () => {
	const props = {
		match: {
			params: {
				id_folder: '101'
			}
		},
		notes: [
			{
				id: '1',
				id_folder: '101',
				name: 'test-note-title',
				modified: new Date(2019, 8, 30)
			}
		]
	};

	it('renders a NoteList by default', () => {
		const wrapper = shallow(<NoteList {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('renders the NoteList given props', () => {
		const wrapper = shallow(<NoteList {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});
});
