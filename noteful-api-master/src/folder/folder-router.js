const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');

const FolderService = require('./folder-service');
const { getFolderValidationError } = require('./folder-validator');

const folderRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
	id: folder.id,
	name: xss(folder.name)
});

folderRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db');
		FolderService.getAllFolders(knexInstance)
			.then(folders => {
				res.json(folders.map(serializeFolder));
			})
			.catch(next);
	})
	.post(jsonParser, (req, res, next) => {
		const { name } = req.body;
		const newFolder = { name };
		const knexInstance = req.app.get('db');

		for (const field of ['name']) {
			if (!req.body[field]) {
				logger.error({
					message: `${field} is required`,
					request: `${req.originalUrl}`,
					method: `${req.method}`,
					ip: `${req.ip}`
				});
				return res.status(400).send({
					error: { message: `'${field}' is required` }
				});
			}
		}

		const error = getFolderValidationError(newFolder);
		if (error) {
			logger.error({
				message: `POST Validation Error`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).send(error);
		}

		FolderService.insertFolder(knexInstance, newFolder)
			.then(folder => {
				logger.info({
					message: `Folder with id ${folder.id} created.`,
					request: `${req.originalUrl}`,
					method: `${req.method}`,
					ip: `${req.ip}`
				});
				res
					.status(201)
					.location(path.posix.join(req.originalUrl, `/${folder.id}`))
					.json(serializeFolder(folder));
			})
			.catch(next);
	});

folderRouter
	.route('/:id')
	.all((req, res, next) => {
		const { id } = req.params;
		const knexInstance = req.app.get('db');
		FolderService.getById(knexInstance, id)
			.then(folder => {
				if (!folder) {
					logger.error({
						message: `Folder with id ${id} not found.`,
						request: `${req.originalUrl}`,
						method: `${req.method}`,
						ip: `${req.ip}`
					});
					return res.status(404).json({
						error: { message: `Folder Not Found` }
					});
				}
				res.folder = folder;
				next();
			})
			.catch(next);
	})
	.get((req, res) => {
		res.json(serializeFolder(res.folder));
	})
	.delete((req, res, next) => {
		const { id } = req.params;
		const knexInstance = req.app.get('db');
		FolderService.deleteFolder(knexInstance, id)
			.then(numRowsAffected => {
				logger.info({
					message: `Folder with id ${id} deleted.`,
					request: `${req.originalUrl}`,
					method: `${req.method}`,
					ip: `${req.ip}`
				});

				// need to send back message instead of .end()
				res.status(204).json({
					message: true
				});
			})
			.catch(next);
	})
	.patch(jsonParser, (req, res, next) => {
		const knexInstance = req.app.get('db');
		const { id } = req.params;
		const { name } = req.body;
		const folderToUpdate = { name };

		const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			logger.error({
				message: `Invalid update without required fields`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).json({
				error: {
					message: `Update must contain folder name`
				}
			});
		}

		const error = getFolderValidationError(folderToUpdate);
		if (error) {
			logger.error({
				message: `PATCH Validation Error`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).send(error);
		}

		FolderService.updateFolder(knexInstance, id, folderToUpdate)
			.then(numRowsAffected => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = folderRouter;
