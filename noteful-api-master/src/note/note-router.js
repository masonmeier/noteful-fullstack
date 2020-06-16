const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');

const NoteService = require('./note-service');
const { getNoteValidationError } = require('./note-validator');

const noteRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
	id: note.id,
	name: xss(note.name),
	id_folder: note.id_folder,
	content: xss(note.content),
	modified: note.modified
});

noteRouter
	.route('/')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db');
		NoteService.getAllNotes(knexInstance)
			.then(notes => {
				res.json(notes.map(serializeNote));
			})
			.catch(next);
	})
	.post(jsonParser, (req, res, next) => {
		const { name, id_folder, content } = req.body;
		const newNote = { name, id_folder, content };

		const knexInstance = req.app.get('db');

		for (const field of ['name', 'id_folder', 'content']) {
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

		const error = getNoteValidationError(newNote);
		if (error) {
			logger.error({
				message: `POST Validation Error`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).send(error);
		}

		NoteService.insertNote(knexInstance, newNote)
			.then(note => {
				logger.info({
					message: `Note with id ${note.id} created.`,
					request: `${req.originalUrl}`,
					method: `${req.method}`,
					ip: `${req.ip}`
				});
				res
					.status(201)
					.location(path.posix.join(req.originalUrl, `/${note.id}`))
					.json(serializeNote(note));
			})
			.catch(next);
	});

noteRouter
	.route('/:id')
	.all((req, res, next) => {
		const { id } = req.params;
		const knexInstance = req.app.get('db');
		NoteService.getById(knexInstance, id)
			.then(note => {
				if (!note) {
					logger.error({
						message: `Note with id ${id} not found.`,
						request: `${req.originalUrl}`,
						method: `${req.method}`,
						ip: `${req.ip}`
					});
					return res.status(404).json({
						error: { message: `Note Not Found` }
					});
				}
				res.note = note;
				next();
			})
			.catch(next);
	})
	.get((req, res) => {
		res.json(serializeNote(res.note));
	})
	.delete((req, res, next) => {
		const { id } = req.params;
		const knexInstance = req.app.get('db');
		NoteService.deleteNote(knexInstance, id)
			.then(numRowsAffected => {
				logger.info({
					message: `Note with id ${id} deleted.`,
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
		const { name, id_folder, content } = req.body;
		const noteToUpdate = { name, id_folder, content };

		const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			logger.error({
				message: `Invalid update without required fields`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).json({
				error: {
					message: `Request body must contain either 'name', 'id_folder', or 'content'`
				}
			});
		}

		const error = getNoteValidationError(noteToUpdate);
		if (error) {
			logger.error({
				message: `PATCH Validation Error`,
				request: `${req.originalUrl}`,
				method: `${req.method}`,
				ip: `${req.ip}`
			});
			return res.status(400).send(error);
		}

		NoteService.updateNote(knexInstance, id, noteToUpdate)
			.then(numRowsAffected => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = noteRouter;
