import React from 'react'
import * as MailComposer from 'expo-mail-composer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import styles from './styles'

// @ts-ignore
import logoImg from '../../assets/logo.png'

export default function Detail() {
	const navigation = useNavigation()
	const route = useRoute()

	const {
		name,
		title,
		description,
		value,
		whatsapp,
		email,
		city,
		uf,
	} = route.params['incident']

	const navigateToIncidents = () => {
		navigation.goBack()
	}

	const message = `Olá, ${ name }
		Gostaria de ajudar no caso "${title }" com o valor de ${ Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value) }`

	const sendEmail = () => MailComposer.composeAsync({
		subject: `Herói do caso: ${ title }`,
		recipients: [email],
		body: message,
	})

	const sendWhatsapp = () =>
		Linking.openURL(`whatsapp://send?phone=+55${ whatsapp }&text=${ message }`)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image source={logoImg} />

				<TouchableOpacity onPress={navigateToIncidents}>
					<Feather name="arrow-left" size={28} color="#E02041" />
				</TouchableOpacity>
			</View>

			<View style={styles.incident}>
				<Text style={{ ...styles.incidentProperty, marginTop: 0 }}>ONG</Text>
				<Text style={styles.incidentValue}>{name} - {city}/{uf}</Text>

				<Text style={styles.incidentProperty}>CASO</Text>
				<Text style={styles.incidentValue}>{description}</Text>

				<Text style={styles.incidentProperty}>VALOR</Text>
				<Text style={styles.incidentValue}>{
					Intl.NumberFormat('pt-BR', {
						style: 'currency',
						currency: 'BRL',
					}).format(value)
				}</Text>
			</View>

			<View style={styles.contactBox}>
				<Text style={styles.heroTitle}>Salve o dia</Text>
				<Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

				<Text style={styles.heroDescription}>Entre em contato:</Text>

				<View style={styles.actions}>
					<TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
						<Text style={styles.actionText}>Whatsapp</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.action} onPress={sendEmail}>
						<Text style={styles.actionText}>Email</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}