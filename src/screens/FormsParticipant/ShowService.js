import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setHeaderOptions } from '../../components/ui/HeaderTitle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Switch } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import CardParticipant from '../../components/ui/CardParticipant';
import api from './../../services/endpont';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import LoadingInfo from '../../components/ui/LoadingInfo';
import Toolbar from '../../components/ui/Toolbar';
import { Checkbox } from '../../components/Icons/Icons';

export default function CreateService() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventEducationalId, priorities } = route.params || {};

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [isSpecialistRequired, setIsSpecialistRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [cpf, setCpf] = useState('');
  const [sexo, setSexo] = useState('');
  const [participant, setParticipant] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [instrutor, setInstrutor] = useState('');
  const [age, setAge] = useState('');
  const [physicalPeopleId, setPhysicalPeopleId] = useState('');
  const [actionServices, setActionServices] = useState([]);

  const [alergiasChecked, setAlergiasChecked] = useState(false);
  const [medicamentosChecked, setMedicamentosChecked] = useState(false);
  const [condicoesChecked, setCondicoesChecked] = useState(false);

  const [isPrioridade, setIsPrioridade] = useState(false);

  const [alergiasText, setAlergiasText] = useState('');
  const [medicamentosText, setMedicamentosText] = useState('');
  const [condicoesText, setCondicoesText] = useState('');
  const [descritionText, setDescritionText] = useState('');
  const [specialistText, setSpecialistText] = useState('');
  const [situation, setSituation] = useState('');
  const [prioritieId, setPrioritieId] = useState('');
  const [qdtPrioridade, setQdtPrioridade] = useState(3);

  const [actionServiceValues, setActionServiceValues] = useState(
    actionServices.reduce((acc, item) => {
      acc[item.id] = item.mandatory_value === '1' ? false : '';
      return acc;
    }, {}),
  );

  const handleCheckboxChange = id => {
    setActionServiceValues(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleTextInputChange = (id, value) => {
    setActionServiceValues(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleStore = async () => {
    if (descritionText === '') {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Aviso',
        textBody: 'Obrigatório informar a observação!',
        button: 'Fechar',
      });
    }
  };

  const avancarEtapa = () => {
    if (etapaAtual === 1) {
      setEtapaAtual(2);
    } else if (etapaAtual === 2) {
      setEtapaAtual(3);
    }
  };

  const prioridade = () => {
    if (qdtPrioridade != 0 && prioritieId == 1 && situation == 1) {
      const qtd = qdtPrioridade - 1;
      setQdtPrioridade(qtd);
      if (qdtPrioridade < 2) {
        setIsPrioridade(true);
        return Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Aviso',
          textBody: `Prioridade Ativada`,
          button: 'Fechar',
        });
      }
      return Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Aviso',
        textBody: `Para ativar prioridade clique mais ${qtd}`,
        button: 'Fechar',
      });
    }
  };

  const stopEtapa = () => {
    if (etapaAtual === 2) {
      setEtapaAtual(1);
    } else if (etapaAtual === 3) {
      setEtapaAtual(2);
    }
  };

  async function loadStorage() {
    const storageUser = await AsyncStorage.getItem('@atendeUser');
    setInstrutor(storageUser);
  }

  async function handleStorePrioridade() {
    try {
      if (!loading) {
        setLoading(true);
        const json = await api.putEventPrioridade(
          eventEducationalId,
          prioritieId,
        );
        if (json.error) {
          setLoading(false);
          return Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Erro',
            textBody: json.message,
            button: 'Fechar',
          });
        }
        setLoading(false);
        setIsPrioridade(false);
        return Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Sucesso',
          textBody: 'Prioridade Atualizada com sucesso.',
          button: 'Fechar',
        });
      }
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

  async function getEventParticipant() {
    try {
      if (eventEducationalId) {
        setLoading(true);
        setActionServices([]);

        const eventService = await api.getShowEvent(eventEducationalId);

        if (eventService.error) {
          setLoading(false);
          return Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Aviso',
            textBody: eventService.error,
            button: 'Fechar',
            onPressButton: () => {
              Dialog.hide();
              setTimeout(() => {
                navigation.goBack();
              }, 300);
            },
          });
        }
        setCpf(eventService.data.cpf);
        setPhysicalPeopleId(eventService.data.physical_people_id);
        setSexo(eventService.data.sexo);
        setParticipant(eventService.data.name_participant);
        setDataNascimento(eventService.data.birth_date);
        setAge(eventService.data.birth_date + ' ' + eventService.data.age);

        setAlergiasChecked(eventService.data.allergy);
        setMedicamentosChecked(eventService.data.medicine_use);
        setCondicoesChecked(eventService.data.medical_conditions);
        setAlergiasText(eventService.data.allergy_value);
        setMedicamentosText(eventService.data.medicine_use_value);
        setCondicoesText(eventService.data.medical_conditions_value);
        setDescritionText(eventService.data.description);
        setActionServices(eventService.data.actionPlanServices);
        setSituation(eventService.data.situation);
        setPrioritieId(eventService.data.prioritie_id);

        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro de Conexão',
        textBody:
          'Houve uma falha na conexão, verifique a internet e tente novamente.',
        button: 'OK',
        onPressButton: () => {
          Dialog.hide();
          setTimeout(() => {
            navigation.goBack();
          }, 300);
        },
      });
    }
  }

  useEffect(() => {
    setHeaderOptions(navigation, {
      headerTitle: 'Dados do Participante',
      headerTitleStyle: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
      },
      headerTintColor: '#000',
      headerStyle: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
    loadStorage();
    getEventParticipant();
  }, [navigation]);

  const pickerSelectStyles = {
    inputIOS: {
      ...styles.input,
      paddingVertical: 12,
    },
    inputAndroid: {
      ...styles.input,
      paddingVertical: 8,
      color: '#333',
    },
    placeholder: {
      color: '#999',
    },
    iconContainer: {
      top: 15,
      right: 15,
    },
  };

  const renderEtapa = () => {
    if (etapaAtual === 1) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Histórico Médico</Text>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={alergiasChecked ? 'checked' : 'unchecked'}
                onPress={() => {}}
                color="#333"
                disabled={true}
              />
              <Text style={styles.checkboxLabel}>Possui alergias?</Text>
            </View>
            <TextInput
              style={styles.textarea}
              value={alergiasText}
              placeholder="Descreva as alergias..."
              placeholderTextColor="#999"
              editable={false}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={medicamentosChecked ? 'checked' : 'unchecked'}
                onPress={() => {}}
                color="#333"
                disabled={true}
              />
              <Text style={styles.checkboxLabel}>Medicamentos em uso?</Text>
            </View>
            <TextInput
              style={styles.textarea}
              value={medicamentosText}
              placeholder="Descreva os medicamentos..."
              placeholderTextColor="#999"
              editable={false}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={condicoesChecked ? 'checked' : 'unchecked'}
                onPress={() => {}}
                color="#333"
                disabled={true}
              />
              <Text style={styles.checkboxLabel}>Condições Médicas?</Text>
            </View>
            <TextInput
              style={styles.textarea}
              value={condicoesText}
              placeholder="Descreva as condições médicas..."
              placeholderTextColor="#999"
              editable={false}
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => avancarEtapa()}
          >
            <Text style={styles.buttonTextPrimary}>Próximo</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (etapaAtual === 2) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>PROCEDIMENTOS</Text>
          {actionServices.map(item => (
            <View key={item.id} style={styles.inputGroup}>
              {item.mandatory_value === '1' && (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() => handleCheckboxChange(item.id)}
                  disabled={true}
                >
                  <Checkbox
                    status={'checked'}
                    color="#00A859"
                    disabled={true}
                  />
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceTitle}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {item.mandatory_value != '1' && (
                <View>
                  <Text style={styles.label}>{item.name}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={item.description}
                    placeholderTextColor="#999"
                    editable={false}
                    value={
                      actionServiceValues[item.id]
                        ? actionServiceValues[item.id].toString()
                        : ''
                    }
                  />
                </View>
              )}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => stopEtapa()}
            >
              <Text style={styles.previousButtonText}>VOLTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => avancarEtapa()}
            >
              <Text style={styles.buttonTextPrimary}>AVANÇAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (etapaAtual === 3) {
      return (
        <View style={styles.formContainer}>
          {isPrioridade && (
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
                    label: 'Selecione a Prioridade...',
                    value: null,
                  }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <TouchableOpacity onPress={() => prioridade()}>
              <Text style={styles.label}>OBSERVAÇÕES</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textarea}
              value={descritionText}
              placeholder="Nenhuma observação"
              placeholderTextColor="#999"
              editable={false}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Necessita de atuação de especialista?
            </Text>
            <Text style={styles.helperText}>
              Marque esta opção se foi identificado a necessidade de
              encaminhamento para um especialista.
            </Text>
            <View style={styles.specialistContainer}>
              <Text style={styles.checkboxLabel}>Sim, é necessário.</Text>
              <Switch
                value={isSpecialistRequired}
                onValueChange={() =>
                  setIsSpecialistRequired(!isSpecialistRequired)
                }
                color="#37C064"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>INTERCORRÊNCIA (SE HOUVER)</Text>
            <TextInput
              style={styles.textarea}
              value={specialistText}
              onChangeText={setSpecialistText}
              multiline={true}
              editable={false}
              placeholder="Nenhuma intercorrência descrita"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.previousButton}
              onPress={() => stopEtapa()}
            >
              <Text style={styles.previousButtonText}>VOLTAR</Text>
            </TouchableOpacity>

            {isPrioridade && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleStorePrioridade()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonTextPrimary}>
                    Alterar Prioridade
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
  };
  return (
    <>
      <View style={styles.toolbarContainer}>
        <Toolbar
          title="Dados do Participante"
          iconColor="#2e2e2eff"
          titleColor="#535353ff"
          onNavigate={() => navigation.goBack()}
        />
      </View>
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <LoadingInfo visible={loading} />

        <CardParticipant
          nameInstrutor={instrutor}
          cpf={cpf}
          sexo={sexo}
          dateNascimento={age}
          namePartipant={participant}
        />
        {renderEtapa()}
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 52,
    backgroundColor: '#FFF',
    color: '#333',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#FFF',
    color: '#333',
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#37C064',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previousButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  serviceTitle: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  specialistContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
