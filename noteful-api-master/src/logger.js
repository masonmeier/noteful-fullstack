const { createLogger, format, transports } = require('winston');
const { combine, timestamp, ms, colorize, json, simple } = format;

const { NODE_ENV } = require('./config');

// set up Winston logger
// Winston has six levels of severity: silly, debug, verbose, info, warn and error.
// The logs will be stored in a file named info.log in JSON format. In the development environment, it will also log to the console, colorized.

const logger = createLogger({
	level: 'info',
	format: combine(timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }), ms(), json()),
	transports: [new transports.File({ filename: 'info.log' })]
});

if (NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: combine(colorize(), simple())
		})
	);
}

module.exports = logger;
