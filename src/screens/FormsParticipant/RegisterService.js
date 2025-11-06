import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { setHeaderOptions } from '../../components/ui/HeaderTitle';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/dateFormat';
import { formatPhoneNumber } from '../../utils/formatInput';
import api from '../../services/endpont';
import { validarCampos, validarHistorico } from '../../utils/valideInput';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ms } from 'react-native-size-matters'; // Importando o size-matters
import {
  SearchIcon,
  BackPage,
  ArrowDownIcon,
  Checkbox,
  CheckboxFill,
} from '../../components/Icons/Icons';

import { FormHeader } from '../../components/FormHeader';
import Toolbar from '../../components/ui/Toolbar';

const RegisterService = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, genders, states, cities, priorities } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [step, setStep] = useState(1);
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

  const handleCardPress = id => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(itemId => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const formatCPF = cpf => {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
  };

  const onChangeInicial = (event, selectedDate) => {
    const currentDate = selectedDate || dateInicial;
    setShowDate(Platform.OS === 'ios');
    setDateInicial(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1) +
      '/' +
      tempDate.getFullYear();
    setTextDateInicial(fDate);
    // Atualiza o campo de data de nascimento formatado, se necessário
    setDataNascimento(fDate);
  };

  const handleCpfChange = text => {
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

  async function handleStore() {
    if (selectedIds.length === 0) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Aviso',
        textBody: 'Selecione no mínimo um atendimento!',
        button: 'Fechar',
      });
    }
    const message = validarHistorico(
      alergiasChecked,
      alergiasText,
      medicamentosChecked,
      medicamentosText,
      condicoesChecked,
      condicoesText,
    );
    if (message != '') {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Aviso',
        textBody: message,
        button: 'Fechar',
      });
    }

    try {
      if (!loading) {
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
          selectedIds,
        );
        if (json.error) {
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
  }

  useEffect(() => {
    // Usando o estilo de header do protótipo original, pois os exemplos não definem um header
    setHeaderOptions(navigation, {
      headerTitle: 'Novo Atendimento',
      headerTitleStyle: { fontFamily: 'Arial', fontSize: 14, color: '#FFF' },
      headerTintColor: '#FFF',
      headerStyle: { backgroundColor: '#37C064' },
    });
  }, [navigation]);

  const showModeInicial = currentMode => {
    setShowDate(true);
    setModeInicial(currentMode);
  };
  const showDatepickerInicial = () => {
    if (isInputEnabled) {
      showModeInicial('date');
    }
  };

  const avancarEtapa = () => {
    const message = validarCampos(
      cpf,
      nome,
      genderId,
      stateId,
      cityId,
      email,
      celular,
      prioritieId,
    );
    if (message != '') {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Erro',
        textBody: message,
        button: 'Fechar',
      });
    }
    if (services.length == 0) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Erro',
        textBody:
          'Participante já participando de todos os atendimentos disponíveis.',
        button: 'Fechar',
      });
    }
    setEtapaAtual(2);
  };

  async function handleSearchCpf() {
    try {
      if (!loading) {
        setLoading(true);
        const json = await api.getParticipantCpf(cpf, eventId);
        setServices([]);
        setSelectedIds([]);
        if (json.error) {
          setLoading(false);
          return Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Erro',
            textBody: json.message,
            button: 'Fechar',
          });
        }
        const nascimento = json.data.birth_date + '  -  ' + json.data.age;
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
        setIsInputEnabled(true); // Habilita campos se CPF for encontrado/novo
        setIsVisibleDate(true); // Habilita o seletor de data se for um novo cadastro
        console.log(json.data);

        if (json.data.services.length == 0) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Erro',
            textBody:
              'Participante já participando de todos os atendimentos disponíveis.',
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
  };

  // Estilos do RNPickerSelect baseados nos exemplos
  const pickerSelectStyles = {
    inputIOS: {
      ...styles.pickerText,
      height: ms(45),
      paddingHorizontal: ms(15),
    },
    inputAndroid: {
      ...styles.pickerText,
      height: ms(45),
      paddingHorizontal: ms(15),
      color: '#333', // Cor do texto no Android
    },
    placeholder: {
      ...styles.placeholderPicker,
    },
    iconContainer: {
      top: ms(10),
      right: ms(15),
    },
  };

  const renderEtapa = () => {
    if (etapaAtual === 1) {
      return (
        <View style={styles.formContainer}>
          <View style={styles.toolbarContainer}>
            <Toolbar
              title="Dados do Participante"
              iconColor="#2e2e2eff"
              titleColor="#535353ff"
              onNavigate={() => navigation.goBack()} // Corrigi para navegação
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <View style={styles.cpfContainer}>
              <TextInput
                style={styles.inputCpf}
                placeholder="Informe o CPF"
                placeholderTextColor="#999"
                value={cpf}
                onChangeText={handleCpfChange}
                keyboardType="numeric"
                maxLength={14}
              />
              <TouchableOpacity
                style={styles.consultarButton}
                onPress={() => handleSearchCpf()}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.buttonContent}>
                    <SearchIcon width={16} height={16} color="#fff" />
                    <Text style={styles.buttonText}>Consultar</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Informe o nome completo"
              placeholderTextColor="#999"
              editable={isInputEnabled}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <Text style={styles.label}>Data de Nascimento</Text>
              {!isVisibleDate && (
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  editable={isInputEnabled}
                  maxLength={10}
                />
              )}
              {isVisibleDate && (
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={showDatepickerInicial}
                >
                  <Text
                    style={[
                      dataNascimento ? styles.dateText : styles.datePlaceholder,
                      {
                        // Ajuste fino para alinhamento vertical
                        paddingVertical: ms(12),
                      },
                    ]}
                    numberOfLines={1} // Garante uma única linha
                    ellipsizeMode="tail" // Adiciona "..." se o texto for muito longo
                  >
                    {dataNascimento ? dataNascimento : 'DD/MM/AAAA'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.flexHalf}>
              {/* Campo Sexo permanece igual */}
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={value => setGenderId(value)}
                  items={genders}
                  value={genderId}
                  style={pickerSelectStyles}
                  Icon={() => (
                    <ArrowDownIcon
                      name="arrow-drop-down"
                      size={24}
                      color="#666"
                    />
                  )}
                  placeholder={{
                    label: 'Selecione',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                  disabled={!isInputEnabled}
                />
              </View>
            </View>
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={value => setStateId(value)}
                items={states}
                value={stateId}
                style={pickerSelectStyles}
                Icon={() => (
                  <ArrowDownIcon
                    name="arrow-drop-down"
                    size={24}
                    color="#666"
                  />
                )}
                placeholder={{
                  label: 'Selecione o Estado',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                disabled={!isInputEnabled}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={value => setCityId(value)}
                items={cities}
                value={cityId}
                style={pickerSelectStyles}
                Icon={() => (
                  <ArrowDownIcon
                    name="arrow-drop-down"
                    size={24}
                    color="#666"
                  />
                )}
                placeholder={{
                  label: 'Selecione a Cidade',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                disabled={!isInputEnabled || !stateId}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe o telefone"
              value={formatPhoneNumber(celular)}
              onChangeText={text => setCelular(text)}
              keyboardType="phone-pad"
              maxLength={15}
              editable={isInputEnabled}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe o e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={isInputEnabled}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: isValidCpf ? '#00A859' : '#B0B0B0' },
            ]}
            onPress={isValidCpf ? avancarEtapa : null}
            disabled={!isValidCpf}
          >
            <Text style={styles.buttonTextPrimary}>Próximo</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (etapaAtual === 2) {
      return (
        <View style={styles.formContainer}>
          <Toolbar
            title="Dados do Participante"
            iconColor="#2e2e2eff"
            titleColor="#535353ff"
            onNavigate={() => navigation.goBack()} // Corrigi para navegação
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Participante</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={nome}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={value => setPrioritieId(value)}
                items={priorities}
                value={prioritieId}
                style={pickerSelectStyles}
                Icon={() => (
                  <ArrowDownIcon
                    name="arrow-drop-down"
                    size={24}
                    color="#666"
                  />
                )}
                placeholder={{
                  label: 'Selecione a Prioridade',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>Selecione os atendimentos</Text>
            {services.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceItem}
                onPress={() => handleCardPress(item.id)}
              >
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => handleCardPress(item.id)}
                  >
                    {selectedIds.includes(item.id) ? (
                      <CheckboxFill color="#00A859" />
                    ) : (
                      <Checkbox color="#333" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>{item.name}</Text>
                  <Text style={styles.serviceSubtitle}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>Histórico Médico</Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setAlergiasChecked(!alergiasChecked)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                {alergiasChecked ? (
                  <CheckboxFill color="#00A859" />
                ) : (
                  <Checkbox color="#333" />
                )}
                <Text style={styles.checkboxLabel}>Possui alergias?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textarea}
              placeholder="Descreva as alergias..."
              value={alergiasText}
              onChangeText={setAlergiasText}
              editable={alergiasChecked}
              multiline
              placeholderTextColor="#999"
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setMedicamentosChecked(!medicamentosChecked)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                {medicamentosChecked ? (
                  <CheckboxFill color="#00A859" />
                ) : (
                  <Checkbox color="#333" />
                )}
                <Text style={styles.checkboxLabel}>Medicamentos em uso?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textarea}
              placeholder="Descreva os medicamentos..."
              value={medicamentosText}
              onChangeText={setMedicamentosText}
              editable={medicamentosChecked}
              multiline
              placeholderTextColor="#999"
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setCondicoesChecked(!condicoesChecked)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                {condicoesChecked ? (
                  <CheckboxFill color="#00A859" />
                ) : (
                  <Checkbox color="#333" />
                )}
                <Text style={styles.checkboxLabel}>Condições médicas?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textarea}
              placeholder="Descreva as condições médicas..."
              value={condicoesText}
              onChangeText={setCondicoesText}
              editable={condicoesChecked}
              multiline
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => stopEtapa()}
            >
              <Text style={styles.previousButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton]}
              onPress={!isStore ? handleStore : null}
              disabled={isStore}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonTextPrimary}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      {renderEtapa()}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', // Cor de fundo neutra
  },
  formContainer: {
    padding: ms(20),
  },
  inputGroup: {
    marginBottom: ms(15),
  },
  label: {
    fontSize: ms(13),
    color: '#333',
    marginBottom: ms(8),
    fontWeight: '600', // Fonte dos exemplos
  },
  placeholderPicker: {
    fontSize: ms(13),
    color: '#999',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
  },
  input: {
    borderWidth: ms(1),
    borderColor: '#ccc',
    borderRadius: ms(8),
    paddingHorizontal: ms(15),
    fontSize: ms(13),
    height: ms(45),
    backgroundColor: '#fff',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    color: '#333',
  },
  readOnlyInput: {
    backgroundColor: '#f4f4f4', // Fundo cinza para campos somente leitura
    color: '#666',
  },
  cpfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    borderWidth: ms(1),
    borderColor: '#ccc',
    borderRadius: ms(8),
    paddingHorizontal: ms(15),
    fontSize: ms(13),
    height: ms(45),
    backgroundColor: '#fff',
    fontFamily: 'Ubuntu-Regular',
    color: '#333',
    justifyContent: 'center', // Centraliza o texto verticalmente
  },
  dateText: {
    fontSize: ms(12),
    fontFamily: 'Ubuntu-Regular',
    color: '#333',
    lineHeight: ms(16), // Controla o espaçamento entre linhas
  },
  datePlaceholder: {
    fontSize: ms(12),
    fontFamily: 'Ubuntu-Regular',
    color: '#999',
    lineHeight: ms(16),
  },
  toolbarContainer: {
    marginLeft: -ms(12), // Compensa o padding do formContainer
    marginRight: -ms(20),
    marginTop: -ms(20),
    marginBottom: ms(10),
  },

  inputCpf: {
    flex: 1,
    borderWidth: ms(1),
    borderColor: '#ccc',
    borderRadius: ms(8),
    paddingHorizontal: ms(15),
    fontSize: ms(13),
    height: ms(45),
    backgroundColor: '#fff',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    color: '#333',
  },
  consultarButton: {
    backgroundColor: '#00A859', // Cor do botão dos exemplos
    height: ms(45),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    marginLeft: ms(10),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    fontSize: ms(14),
    marginLeft: ms(8),
  },
  buttonTextPrimary: {
    color: 'white',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    fontSize: ms(15),
  },
  toolbar: {
    paddingLeft: 0, // Remove padding à esquerda
    marginLeft: 0, // Remove margem à esquerda
  },
  row: {
    flexDirection: 'row',
    gap: ms(10),
    marginBottom: ms(15),
  },
  flexHalf: {
    flex: ms(1),
  },
  pickerContainer: {
    borderWidth: ms(1),
    borderColor: '#ccc',
    borderRadius: ms(8),
    height: ms(45),
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pickerText: {
    color: '#333',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    fontSize: ms(12),
    paddingHorizontal: ms(2), // Adicionado para alinhar com o input
  },
  primaryButton: {
    flex: ms(1),
    backgroundColor: '#00A859',
    borderWidth: ms(1),
    borderColor: '#00A859',
    borderRadius: ms(8),
    height: ms(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousButton: {
    flex: ms(1),
    backgroundColor: '#fff',
    borderWidth: ms(1),
    borderColor: '#ccc',
    borderRadius: ms(8),
    height: ms(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousButtonText: {
    color: '#333',
    fontFamily: 'Ubuntu-Regular', // Fonte dos exemplos
    fontSize: ms(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: ms(10),
    marginTop: ms(20),
    marginBottom: ms(20),
  },
  sectionTitle: {
    fontSize: ms(14),
    fontFamily: 'Ubuntu-Bold', // Fonte dos exemplos
    color: '#333',
    marginBottom: ms(10),
    marginTop: ms(10),
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(10),
    backgroundColor: '#fff',
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: ms(8),
  },
  serviceTitle: {
    fontSize: ms(14),
    fontFamily: 'Ubuntu-Regular',
    color: '#333',
  },
  serviceSubtitle: {
    fontSize: ms(12),
    fontFamily: 'Ubuntu-Regular',
    color: '#666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(10),
    marginBottom: ms(5),
  },
  checkboxLabel: {
    fontSize: ms(14),
    fontFamily: 'Ubuntu-Regular',
    color: '#333',
    marginLeft: ms(8),
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: ms(15),
    fontSize: ms(13),
    minHeight: ms(80),
    textAlignVertical: 'top',
    fontFamily: 'Ubuntu-Regular',
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: ms(10),
  },
});

export default RegisterService;
