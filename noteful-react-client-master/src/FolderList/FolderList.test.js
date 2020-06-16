import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import FolderList from './FolderList';

describe(`FolderList component`, () => {
	const props = {
		match: {
			params: {
				id_folder: '101'
			}
		},
		folders: [
			{
				id: '101',
				name: 'test-folder-label'
			}
		]
	};

	it('renders a FolderList by default', () => {
		const wrapper = shallow(<FolderList {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it('renders the FolderList given props', () => {
		const wrapper = shallow(<FolderList {...props} />);
		expect(toJson(wrapper)).toMatchSnapshot();
	});
});
