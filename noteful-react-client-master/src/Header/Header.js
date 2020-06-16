import React from 'react';
import { Link } from 'react-router-dom';

const Header = props => {
	return (
		<header>
			<span>
				<h1>
					<Link to="/">Noteful</Link>
				</h1>
			</span>
			<span>
				a React app
				<br />
				(everything takes a couple of seconds to load)
			</span>
		</header>
	);
};

export default Header;
