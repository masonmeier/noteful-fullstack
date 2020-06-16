// Error Boundary component
// NOTE: MUST use class

import React from 'react';

class NoteError extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h2>Could not display this note.</h2>;
		}
		return this.props.children;
	}
}
export default NoteError;
