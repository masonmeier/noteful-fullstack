const { NODE_ENV } = require('./config');
const logger = require('./logger');

function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		console.error(error);
		response = { error: { message: 'server error' } };
	} else {
		console.error(error);

		// include winston logging
		// to just log message:
		// logger.error(error.message);
		// logger.error(
		// 	`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${
		// 		req.method
		// 	} - ${req.ip}`
		// );
		console.error('XXX error-hander: ', error);
		logger.error('XXX ERROR-HANDLER-LOGGER XXX');

		response = { message: error.message, error };
	}
	res.status(500).json(response);
}

module.exports = errorHandler;
