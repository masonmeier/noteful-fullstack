require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./error-handler');

const noteRouter = require('./note/note-router');
const folderRouter = require('./folder/folder-router');

const app = express();

app.use(
	morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
		skip: () => NODE_ENV === 'test'
	})
);

app.use(cors());
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(validateBearerToken);

app.use('/api/notes', noteRouter);
app.use('/api/folders', folderRouter);

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.use(errorHandler);
module.exports = app;
