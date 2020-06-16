const logger = require('../logger');

const NO_ERRORS = null;

// name, id_folder, content

function getNoteValidationError({ name, content }) {
	if (name && name.length < 3) {
		logger.error(`Invalid name '${name}' supplied`);
		return {
			error: {
				message: `'name' must be at least 3 characters`
			}
		};
	}

	if (content && content.length < 5) {
		logger.error(`Invalid content '${content}' supplied`);
		return {
			error: {
				message: `'content' must be at least 5 characters`
			}
		};
	}

	return NO_ERRORS;
}

module.exports = {
	getNoteValidationError
};
