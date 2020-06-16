import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NoteItem from './NoteItem';

describe(`NoteItem component`, () => {
	const props = {
		note: {
			id: 1,
			id_folder: 101,
			title: 'test-note-title',
			modified: new Date(2019, 8, 30)
		}
	};

	it('renders a NoteItem by default', () => {
		const wrapper = shallow(<NoteItem {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('renders the NoteItem given props', () => {
		const wrapper = shallow(<NoteItem {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});
});
