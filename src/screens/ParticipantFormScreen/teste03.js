import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importe o ícone
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { setHeaderOptions } from '../../components/ui/HeaderTitle';
import RNPickerSelect from 'react-native-picker-select';
import { Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/dateFormat';
import { formatPhoneNumber, isValidEmail } from '../../utils/formatInput';
import api from './../../services/endpont';
import { validarCampos, validarHistorico } from '../../utils/valideInput';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const RegisterService = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { eventId, genders, states, cities, priorities } = route.params || {};

	const [loading, setLoading] = useState(false);
	const [etapaAtual, setEtapaAtual] = useState(1);
	const [cpf, setCpf] = useState('');
	const [nome, setNome] = useState('');
	const [dataNascimento, setDataNascimento] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [celular, setCelular] = useState('');
	const [email, setEmail] = useState('');
	const [isInputEnabled, setIsInputEnabled] = useState(false);
	const [isValidCpf, setIsValidCpf] = useState(false);
	const [isStore, setIsStore] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [services, setServices] = useState([]);

	const [genderId, setGenderId] = useState(null);
	const [stateId, setStateId] = useState(null);
	const [cityId, setCityId] = useState(null);
	const [prioritieId, setPrioritieId] = useState(null);

	const [dateInicial, setDateInicial] = useState(new Date());
    const [modeInicial, setModeInicial] = useState('date');
    const [showDate, setShowDate] = useState(false);
    const [textDateInicial, setTextDateInicial] = useState('01/01/2000');
    const [isVisibleDate, setIsVisibleDate] = useState(false);

    const [alergiasChecked, setAlergiasChecked] = React.useState(false);
	const [medicamentosChecked, setMedicamentosChecked] = React.useState(false);
	const [condicoesChecked, setCondicoesChecked] = React.useState(false);

	const [alergiasText, setAlergiasText] = React.useState('');
	const [medicamentosText, setMedicamentosText] = React.useState('');
	const [condicoesText, setCondicoesText] = React.useState('');

	// Função para alternar a seleção de um item
	const handleCardPress = (id) => {
		setSelectedIds((prevSelectedIds) => {
			if (prevSelectedIds.includes(id)) {
				// Remove o ID se já estiver selecionado
				return prevSelectedIds.filter((itemId) => itemId !== id);
				} else {
				// Adiciona o ID se não estiver selecionado
				return [...prevSelectedIds, id];
			}
		});
	};

	const formatCPF = (cpf) => {
		cpf = cpf.replace(/\D/g, ''); 
		cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
		cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
		cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
		return cpf;
	};

	const onChangeInicial = (event, selectedDate) => {
        var currentDate = dateInicial;
        if (selectedDate){
            var currentDate = selectedDate || date;
         }
        setShowDate(Platform.OS === 'ios');
        setDateInicial(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear();
        setTextDateInicial(fDate);
    };

	const handleCpfChange = (text) => {
		let cleanedText = text.replace(/\D/g, '');
		setCpf(formatCPF(cleanedText));
		if (cleanedText.length < 11) {
			setIsValidCpf(false);
			setDataNascimento(''); 
			setNome(''); 
			setEmail(''); 
			setCelular(''); 
			setGenderId(null); 
		}
	};
	
	async function handleStore(){  

		if(selectedIds.length === 0){
			return Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: 'Aviso',
				textBody: 'Selecione no mínimo um atendimento!',
				button: 'Fechar',
			});		
		}
		const message = validarHistorico(alergiasChecked, alergiasText, medicamentosChecked, medicamentosText, condicoesChecked, condicoesText);
		if(message != ''){

			return Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: 'Aviso',
				textBody: message,
				button: 'Fechar',
			});
		}
 
        try{

			if(!loading){	
				setLoading(true);
				setIsStore(true);
				const json = await api.postEventParticipant(
					cpf, 
					nome, 
					genderId, 
					birthDate, 
					stateId, 
					cityId, 
					email, 
					celular, 
					alergiasChecked, 
					medicamentosChecked, 
					condicoesChecked, 
					alergiasText, 
					medicamentosText, 
					condicoesText, 
					eventId, 
					prioritieId,
					selectedIds);
				if(json.error){
					console.log('TENTEI 1:', json);	
					setLoading(false);
					setIsStore(false);
					return Dialog.show({
						type: ALERT_TYPE.DANGER,
						title: 'Erro',
						textBody: json.message,
						button: 'Fechar',
					});
				}
				setLoading(false);

				return Dialog.show({
					type: ALERT_TYPE.SUCCESS,
					title: 'Sucesso',
					textBody: json.message,
					button: 'Fechar',
					onPressButton: () => {
						Dialog.hide();
						setTimeout(() => {
							navigation.goBack();
						}, 300); 
					},
				});
			}
		} catch (error) {
			setLoading(false);
			setIsStore(false);
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Erro',
				textBody: error,
				button: 'Fechar',
			});
        } 
	};

	useEffect(() => {
		setHeaderOptions(navigation, {
		  headerTitle: 'Novo Atendimento',
		  headerTitleStyle: { fontFamily: 'Arial', fontSize: 14, color: '#FFF' },
		  headerTintColor: '#FFF',
		  headerStyle: { backgroundColor: '#37C064' }  
		});
	}, [navigation]);

	const showModeInicial = (currentMode) => {
        setShowDate(true);
        setModeInicial(currentMode);
    };
	const showDatepickerInicial = () => {
		if(isInputEnabled){
			showModeInicial('date');
		}
    };

	const avancarEtapa = () => {
		const message = validarCampos(cpf, nome, genderId, stateId, cityId, email, celular, prioritieId);
		if(message != ''){
			return Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: 'Erro',
				textBody: message,
				button: 'Fechar',
			});
		}
		if(services.length == 0){
			return Dialog.show({
				type: ALERT_TYPE.WARNING,
				title: 'Erro',
				textBody: 'Participante já participando de todos os atendimentos disponíveis.',
				button: 'Fechar',
			});			
		} 
		setEtapaAtual(2);
	}

	async function handleSearchCpf(){
        try{

			if(!loading){		
				setLoading(true);
				const json = await api.getParticipantCpf(cpf, eventId);
				setServices([]);
				setSelectedIds([]);
				if(json.error){
					setLoading(false);
					return Dialog.show({
						type: ALERT_TYPE.DANGER,
						title: 'Erro',
						textBody: json.message,
						button: 'Fechar',
					});
				}
				const nascimento = json.data.birth_date + '  -  '+ json.data.age;
				setDataNascimento(nascimento); 
				setBirthDate(json.data.birth_date);
				setNome(json.data.name_participant); 
				setEmail(json.data.email); 
				setCelular(json.data.cell_phone); 
				setGenderId(json.data.gender_id); 
				setStateId(json.data.state_id); 
				setCityId(json.data.city_id); 
				setPrioritieId(json.data.prioritie_id); 
				setServices(json.data.services);
				setIsValidCpf(true);
				console.log(json.data);
				
				if(json.data.services.length == 0){
					Dialog.show({
						type: ALERT_TYPE.WARNING,
						title: 'Erro',
						textBody: 'Participante já participando de todos os atendimentos disponíveis.',
						button: 'Fechar',
					});			
				} 
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Erro',
				textBody: error,
				button: 'Fechar',
			});
        } 
	}

	const stopEtapa = () => {
		setEtapaAtual(1);
		setLoading(false);
		setIsStore(false);
	}

    const renderEtapa = () => {
        if (etapaAtual === 1) {
            return (
					<View style={styles.formContainer}>
						<Text style={styles.title}>Dados do Participante</Text>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>CPF</Text>
							<View style={styles.cpfRow}>
								<TextInput 
									placeholder="Digite o CPF" 
									style={[styles.input, styles.cpfInput]} 
									keyboardType="numeric" 
									value={cpf}
									onChangeText={handleCpfChange}
									maxLength={14} 
								/>
								<TouchableOpacity style={styles.searchButton} onPress={() => handleSearchCpf()} >
									<Text style={styles.labelSearch}>Consultar CPF </Text>
									{loading ? (
										<ActivityIndicator size={20} color="#FFF" />
									) : (
										<Icon name="search" size={20} color="#fff" marginLeft="20px" />
									)}								
								</TouchableOpacity>
							</View>
						</View>   
					
						{/* Nome */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Nome</Text>
							<TextInput 
								placeholder="Digite o nome" 
								style={styles.input} 
								value={nome}
								onChangeText={setNome}
								editable={isInputEnabled}
							/>
						</View>

						{/* Data de Nascimento e Sexo */}
						<View style={styles.row}>

							{!isVisibleDate && (
								<View style={[styles.inputContainer, styles.halfInputContainer, styles.marginRight]}>
									<Text style={styles.label}>Data de Nascimento</Text>
									<TextInput 
										placeholder="01/01/1900" 
										style={styles.input} 
										value={dataNascimento}
										onChangeText={setDataNascimento}
										editable={isInputEnabled}
									/>
								</View>
							)}

							{isVisibleDate && (
								<View style={[styles.inputContainer, styles.halfInputContainer]}>
									<Text style={styles.label}>Data de Nascimento</Text>
									<TouchableOpacity style={styles.input} onPress={showDatepickerInicial}>
										<Text style={[styles.label, { marginTop: 12, color: '#007C6F' }]}>{formatDate(dateInicial)}</Text>
									</TouchableOpacity>
								</View>
							)}


							{showDate && (
								<DateTimePicker
									testID="dateTimePickerInicial"
									value={dateInicial}
									mode={modeInicial}
									is24Hour={true}
									display="default"
									onChange={onChangeInicial}
								/>
							)}
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Sexo</Text>
								<RNPickerSelect
									onValueChange={(value) => setGenderId(value)}
									items={genders}
									value={genderId}
									style={{
									inputIOS: {
										...styles.input, 
										paddingVertical: 12, 
										color: '#007C6F', 
									},
									inputAndroid: {
										...styles.input,
										paddingVertical: 8, 
										width: '101%',
										marginRight: 55,
										color: '#007C6F', 
									},
									iconContainer: {
										top: 10, 
										right: 12, 
									},
									placeholder: {
										color: '#007C6F', 
									}
									}}
									Icon={() => {
									return <IconMaterial name="arrow-drop-down" size={24} color="#007C6F" />;
									}}
									placeholder={{
									label: 'Selecione sexo',
									value: null,
									color: '#007C6F',
									}}
									useNativeAndroidPickerStyle={false} 
								/>
							</View>
						</View>

						{/* Estado */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Estado</Text>
							<RNPickerSelect
								onValueChange={(value) => setStateId(value)}
								items={states} 
								value={stateId}
								style={{
								inputIOS: {
									...styles.input, 
									paddingVertical: 12, 
									color: '#007C6F', 
								},
								inputAndroid: {
									...styles.input,
									paddingVertical: 8, 
									color: '#007C6F', 
								},
								iconContainer: {
									top: 10, // Ajusta a posição do ícone verticalmente
									right: 12, // Ajusta a posição do ícone horizontalmente
								},
								placeholder: {
									color: '#007C6F', 
								}
								}}
								Icon={() => {
								return <IconMaterial name="arrow-drop-down" size={24} color="#007C6F" />; // Define o ícone da seta
								}}
								placeholder={{
									label: 'Selecione um estado...',
									value: null,
									color: '#007C6F',
								}}
								useNativeAndroidPickerStyle={false} 
							/>
						</View>

						{/* Cidade */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Cidade</Text>
							<RNPickerSelect
								onValueChange={(value) => setCityId(value)}
								items={cities} 
								value={cityId}
								style={{
								inputIOS: {
									...styles.input, 
									paddingVertical: 12, 
									color: '#007C6F', 
								},
								inputAndroid: {
									...styles.input,
									paddingVertical: 8, 
									color: '#007C6F', 
								},
								iconContainer: {
									top: 10, 
									right: 12, 
								},
								placeholder: {
									color: '#007C6F', 
								}
								}}
								Icon={() => {
								return <IconMaterial name="arrow-drop-down" size={24} color="#007C6F" />; // Define o ícone da seta
								}}
								placeholder={{
									label: 'Selecione a cidade...',
									value: null,
									color: '#007C6F',
								}}
								useNativeAndroidPickerStyle={false} 
							/>
						</View>

						{/* Celular */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Celular</Text>
							<TextInput 
								placeholder="Digite o celular" 
								style={styles.input} 
								keyboardType="phone-pad" 
								value={formatPhoneNumber(celular)}
								onChangeText={(text) => setCelular(text)}
								maxLength={15}
							/>
						</View>

						{/* E-mail */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>E-mail</Text>
							<TextInput 
								placeholder="Digite o e-mail" 
								style={styles.input} 
								keyboardType="email-address" 
								value={email}
								onChangeText={setEmail}
							/>
						</View>

						<TouchableOpacity
							style={[
							styles.button,
							{ backgroundColor: isValidCpf ? '#37C064' : '#B0B0B0' } 
							]}
							onPress={isValidCpf ? avancarEtapa : null} 
							disabled={!isValidCpf} 
						>
							<Text style={styles.buttonText}>Avançar</Text>
						</TouchableOpacity>
					</View> 
 
			);
        } else if (etapaAtual === 2) {
            return (
                <View style={styles.formContainer}>
                    {/* Conteúdo da segunda etapa */}
                    <Text style={styles.title}>Dados do Atendimento</Text>

					<Text style={styles.titleName}>Nome do Participante</Text>
					<View style={styles.inputName}>
						<Text style={styles.cardTitle}>Administrator</Text>
					</View>
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Prioridade</Text>
						<RNPickerSelect
							onValueChange={(value) => setPrioritieId(value)}
							items={priorities} 
							value={prioritieId}
							style={{
							inputIOS: {
								...styles.input, 
								paddingVertical: 12, 
								color: '#007C6F', 
							},
							inputAndroid: {
								...styles.input,
								paddingVertical: 8, 
								color: '#007C6F', 
							},
							iconContainer: {
								top: 10, 
								right: 12, 
							},
							placeholder: {
								color: '#007C6F', 
							}
							}}
							Icon={() => {
							return <IconMaterial name="arrow-drop-down" size={24} color="#007C6F" />; // Define o ícone da seta
							}}
							placeholder={{
								label: 'Selecione a Prioridade...',
								value: null,
								color: '#007C6F',
							}}
							useNativeAndroidPickerStyle={false} 
						/>
					</View>

					<Text style={styles.sectionTitle}>SELECIONE OS ATENDIMENTOS</Text>
					{services.map((item) => (
						<TouchableOpacity 
							key={item.id}
							style={styles.card} 
							onPress={() => handleCardPress(item.id)}
						>
							<View style={styles.cardContent}>
							<Checkbox
								status={selectedIds.includes(item.id) ? 'checked' : 'unchecked'}
								onPress={() => handleCardPress(item.id)}
								color="#00A878"
							/>
							<View style={styles.cardText}>
								<Text style={styles.cardTitle}>{item.name}</Text>
								<Text style={styles.cardSubtitle}>{item.description}</Text>
							</View>
							</View>
						</TouchableOpacity>
					))}

					<Text style={styles.sectionTitle}>HISTÓRICO MÉDICO</Text>

					{/* Possui Alergias */}
					<View style={styles.checkboxRow}>
						<Checkbox
							status={alergiasChecked ? 'checked' : 'unchecked'}
							onPress={() => setAlergiasChecked(!alergiasChecked)}
							color="#00A878"
						/>
						<Text style={styles.checkboxLabel}>Possui alergias?</Text>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Descreva suas alergias..."
						value={alergiasText}
						onChangeText={setAlergiasText}
						editable={alergiasChecked}
						multiline
					/>

					{/* Medicamentos em uso */}
					<View style={styles.checkboxRow}>
						<Checkbox
							status={medicamentosChecked ? 'checked' : 'unchecked'}
							onPress={() => setMedicamentosChecked(!medicamentosChecked)}
							color="#00A878"
						/>
						<Text style={styles.checkboxLabel}>Medicamentos em uso?</Text>
						</View>
					<TextInput
						style={styles.input}
						placeholder="Descreva os medicamentos..."
						value={medicamentosText}
						onChangeText={setMedicamentosText}
						editable={medicamentosChecked}
						multiline
					/>

					{/* Condições Médicas */}
					<View style={styles.checkboxRow}>
						<Checkbox
							status={condicoesChecked ? 'checked' : 'unchecked'}
							onPress={() => setCondicoesChecked(!condicoesChecked)}
							color="#00A878"
						/>
						<Text style={styles.checkboxLabel}>Condições médicas?</Text>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Descreva as condições médicas..."
						value={condicoesText}
						onChangeText={setCondicoesText}
						editable={condicoesChecked}
						multiline
					/>

                    {/* Botão Salvar */}

					<TouchableOpacity style={styles.buttonBack} onPress={() =>  stopEtapa()}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>

					<TouchableOpacity
						style={[styles.button]}
						onPress={!isStore ? handleStore : null} 
						disabled={isStore} 
					>
						{loading ? (
							<ActivityIndicator size={20} color="#FFF" />
						) : (
							<Text style={styles.buttonText}>Salvar</Text>
						)}	
					</TouchableOpacity>


                </View>
            );
        }
    };


  	return (
		<>
			<KeyboardAwareScrollView
				style={styles.container}
				resetScrollToCoords={{ x: 0, y: 0 }}
				scrollEnabled={true}
			>
				{renderEtapa()}
			</KeyboardAwareScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FAFAFA',
	},
	formContainer: {
		padding: 20,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#454652',
		fontStyle: 'normal',
		textTransform: 'uppercase'
	},
	titleName: {
		fontSize: 12,
		fontWeight: '400',
		color: '#007C6F',
		marginBottom: 5,
		fontStyle: 'normal',
		textTransform: 'uppercase'
	},
	inputContainer: {
		flex: 1,
		marginBottom: 10,
	},
	label: {
		fontSize: 14,
		fontWeight: '400',
		color: '#007C6F',
		marginBottom: 5,
	},
	labelSearch: {
		fontSize: 16,
		fontWeight: '400',
		color: '#FFF',
		marginRight: 10,
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: '#007C6F',
		borderRadius: 8,
		paddingHorizontal: 10,
		fontSize: 16,
		height: 48, // Altura definida para manter a consistência
	},
	inputName: {
		borderWidth: 1,
		borderColor: '#F2F2F4',
		backgroundColor: '#F2F2F4',
		borderRadius: 12,
		padding: 8,
		marginBottom: 12,
		fontSize: 14,
	},
	cpfRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cpfInput: {
		flex: 1,
		marginRight: 10,
	},
	searchButton: {
		backgroundColor: '#007C6F',
		padding: 10,
		borderRadius: 8,
		flexDirection: 'row',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	halfInputContainer: {
		width: '48%',
	},
    marginRight: {
        marginRight: 5,  // Adiciona o espaçamento desejado
    },	
	button: {
		backgroundColor: '#37C064',
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonBack: {
        backgroundColor: '#007C6F',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 30,
    },	
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	card: {
		borderColor: '#00A878',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 12,
		padding: 12,
	},
	cardContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cardText: {
		marginLeft: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	cardSubtitle: {
		fontSize: 14,
		color: '#6c757d',
	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
		marginLeft: 0
	},
	checkboxLabel: {
		fontSize: 16,
		marginLeft: 2,
		color: '#007C6F'
	},
});

export default RegisterService;
