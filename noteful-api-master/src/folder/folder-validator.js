const logger = require('../logger');

const NO_ERRORS = null;

// folder name must at least 3 characters

function getFolderValidationError({ name }) {
	if (name.length < 3) {
		logger.error(`Invalid name '${name}' supplied`);
		return {
			error: {
				message: `'Name' must be more than 3 characters.`
			}
		};
	}

	return NO_ERRORS;
}

module.exports = {
	getFolderValidationError
};
