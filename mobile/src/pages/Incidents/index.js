import React, { useState, useEffect } from 'react'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

// @ts-ignore
import api from '../../services/api'
// @ts-ignore
import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function Incidents() {
	const navigation = useNavigation()

	const navigateToDetail = incident => {
		navigation.navigate('Detail', { incident })
	}

	const [incidents, setIncidents] = useState({
		count: 0,
		list: []
	})

	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)

	const loadIncidents = () => {
		if (loading) return

		if (incidents.count > 0 && incidents.count === incidents.list.length) {
			return
		}

		setLoading(true)

		api.get('/incidents', {
			params: { page }
		})
			.then(response => {
				const count = response.headers['x-total-count']
				const list = response.data

				setIncidents({ count, list: [...incidents.list, ...list] })
				setPage(page + 1)
				setLoading(false)
			})
	}
	useEffect(loadIncidents, [])

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image source={logoImg} />
				<Text style={styles.headerText}>
					Total de <Text style={styles.headerTextBold}>{incidents.count} casos.</Text>
				</Text>
			</View>

			<Text style={styles.title}>
				Bem vindo!
			</Text>
			<Text style={styles.description}>
				Escolha um dos casos abaixo e salve o dia.
			</Text>

			<FlatList
				keyExtractor={incident => incident.id.toString()}
				style={styles.incidentsList}
				data={incidents.list}
				// showsVerticalScrollIndicator={false}
				onEndReached={loadIncidents}
				onEndReachedThreshold={0.2}
				renderItem={({ item: incident }) => (
					<View style={styles.incident}>
						<Text style={styles.incidentProperty}>ONG</Text>
						<Text style={styles.incidentValue}>{incident.name}</Text>

						<Text style={styles.incidentProperty}>CASO</Text>
						<Text style={styles.incidentValue}>{incident.description}</Text>

						<Text style={styles.incidentProperty}>VALOR</Text>
						<Text style={styles.incidentValue}>{
							Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL'
							}).format(incident.value)
						}</Text>

						<TouchableOpacity
							style={styles.detailsButton}
							onPress={() => navigateToDetail(incident)}
						>
							<Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
							<Feather name="arrow-right" size={16} color="#E02041" />
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	)
}