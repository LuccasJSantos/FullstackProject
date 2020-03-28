const express = require('express')
const OngController = require('./controllers/Ong.controller')
const IncidentController = require('./controllers/Incident.controller')
const ProfileController = require('./controllers/Profile.controller')
const SessionController = require('./controllers/Session.controller')
const { celebrate, Segments, Joi } = require('celebrate')

const routes = express.Router()

routes.get('/ongs', OngController.index)

routes.post('/sessions', celebrate({
	[Segments.BODY]: Joi.object().keys({
		id: Joi.string().required(),
	}),
}), SessionController.create)

routes.post('/ongs', celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		whatsapp: Joi.string().required().min(10).max(11),
		city: Joi.string().required(),
		uf: Joi.string().required().length(2),
	}),
}), OngController.create)

routes.get('/profile', celebrate({
	[Segments.HEADERS]: Joi.object({
		authorization: Joi.string().required(),
	}).unknown(),
}), ProfileController.index)

routes.get('/incidents', celebrate({
	[Segments.QUERY]: Joi.object({
		page: Joi.number(),
	}),
}), IncidentController.index)

routes.post('/incidents', celebrate({
	[Segments.HEADERS]: Joi.object({
		authorization: Joi.string().required(),
	}).unknown(),

	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		value: Joi.number().required().greater(0),
	}),
}), IncidentController.create)

routes.delete('/incidents/:id', celebrate({
	[Segments.HEADERS]: Joi.object({
		authorization: Joi.string().required(),
	}).unknown(),

	[Segments.PARAMS]: Joi.object({
		id: Joi.number().required(),
	}),
}), IncidentController.delete)

module.exports = routes