const crypto = require('crypto')
const connection = require('../db/connection')

module.exports = {

	index: async (request, response) => {
		const { page = 1 } = request.query

		const [count] = await connection('incidents').count()

		const incidents = await connection('incidents')
			.join('ongs', 'ongs.id', '=', 'incidents.ong_id')
			.limit(5)
			.offset((page - 1) * 5)
			.select([
				'incidents.*',
				'ongs.name',
				'ongs.email',
				'ongs.whatsapp',
				'ongs.city',
				'ongs.uf',
			])

		response.header('X-Total-Count', count['count(*)'])

		return response.json(incidents)
	},

	create: async (request, response) => {
		const { title, description, value } = request.body
		const ong_id = request.headers.authorization

		const [id] = await connection('incidents').insert({
			title,
			description,
			value,
			ong_id,
		})

		return response.json({ id })
	},

	delete: async (request, response) => {
		const { id } = request.params
		const ong_id = request.headers.authorization

		const incident = await connection('incidents')
			.where('id', id)
			.first()

		if (!incident) {
			return response.status(404).json({ error: 'Incident id not found.' })
		}

		if (incident.ong_id !== ong_id) {
			return response.status(401).json({ error: 'Operation not permitted.' })
		}

		await connection('incidents').where('id', id).delete()

		return response.status(204).send()
	},
}