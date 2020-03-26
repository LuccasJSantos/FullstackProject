import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api'
import './styles.css'

import logoImg from '../../assets/logo.svg'

export default function Profile() {
	const history = useHistory()

	const ongName = localStorage.getItem('ongName')
	const ongId = localStorage.getItem('ongId')

	const [incidents, setIncidents] = useState([])

	useEffect(() => {
		api.get('/profile', {
			headers: {
				Authorization: ongId
			},
		})
			.then(response => {
				setIncidents(response.data)
			})
			.catch(error => {
				console.log(error)
				alert('Erro ao buscar os casos cadastrados')
			})
	}, [ongId])

	const handleDeleteIncident = id => {
		api.delete(`/incidents/${ id }`, {
			headers: {
				Authorization: ongId
			}
		})
			.then(() => setIncidents(incidents.filter(incident => incident.id !== id)))
			.catch(error => {
				console.error(error)
				alert('Erro ao remover o caso, tente novamente')
			})
	}

	const handleLogout = () => {
		localStorage.clear()

		history.push('/')
	}

	return (
		<div className="profile-container">
			<header>
				<img src={logoImg} alt="Be The Hero" />
				<span>Bem vinda, {ongName}</span>

				<Link className="button" to="incidents/new">Cadastrar novo caso</Link>
				<button type="button" onClick={handleLogout}>
					<FiPower size={18} color="#E02041" />
				</button>
			</header>

			<h1>Casos cadastrados</h1>
			<ul>
				{incidents.map(incident => {
					const { id, title, description, value } = incident
					return (
						<li key={id}>
							<strong>CASO</strong>
							<p>{title}</p>

							<strong>DESCRIÇÃO</strong>
							<p>{description}</p>

							<strong>VALOR</strong>
							<p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}</p>

							<button type="button" onClick={() => handleDeleteIncident(id)}>
								<FiTrash2 size={20} color="#A8A8B3" />
							</button>
						</li>
					)
				})}
			</ul>

			{/* <ul>
				<li>
					<strong>CASO</strong>
					<p>Caso teste</p>

					<strong>DESCRIÇÃO</strong>
					<p>Descricao teste</p>

					<strong>VALOR</strong>
					<p>R$ 150,00</p>

					<button type="button">
						<FiTrash2 size={20} color="#A8A8B3" />
					</button>
				</li>

				<li>
					<strong>CASO</strong>
					<p>Caso teste</p>

					<strong>DESCRIÇÃO</strong>
					<p>Descricao teste</p>

					<strong>VALOR</strong>
					<p>R$ 150,00</p>

					<button type="button">
						<FiTrash2 size={20} color="#A8A8B3" />
					</button>
				</li>

				<li>
					<strong>CASO</strong>
					<p>Caso teste</p>

					<strong>DESCRIÇÃO</strong>
					<p>Descricao teste</p>

					<strong>VALOR</strong>
					<p>R$ 150,00</p>

					<button type="button">
						<FiTrash2 size={20} color="#A8A8B3" />
					</button>
				</li>

				<li>
					<strong>CASO</strong>
					<p>Caso teste</p>

					<strong>DESCRIÇÃO</strong>
					<p>Descricao teste</p>

					<strong>VALOR</strong>
					<p>R$ 150,00</p>

					<button type="button">
						<FiTrash2 size={20} color="#A8A8B3" />
					</button>
				</li>
			</ul> */}
		</div>
	)
}