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
import CardParticipant from '../../components/ui/CardParticipant';
import api from './../../services/endpont';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import LoadingInfo from '../../components/ui/LoadingInfo';
import Toolbar from '../../components/ui/Toolbar';
import { Checkbox, CheckboxFill } from '../../components/Icons/Icons';

export default function CreateService() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventEducationalId } = route.params || {};

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

  const [alergiasText, setAlergiasText] = useState('');
  const [medicamentosText, setMedicamentosText] = useState('');
  const [condicoesText, setCondicoesText] = useState('');
  const [descritionText, setDescritionText] = useState('');
  const [specialistText, setSpecialistText] = useState('');

  const [isStore, setIsStore] = useState(false);

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
    try {
      setLoading(true);
      setIsStore(true);
      const json = await api.putEventParticipant(
        eventEducationalId,
        physicalPeopleId,
        alergiasChecked,
        medicamentosChecked,
        condicoesChecked,
        alergiasText,
        medicamentosText,
        condicoesText,
        descritionText,
        specialistText,
        isSpecialistRequired,
        actionServiceValues,
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

  const avancarEtapa = () => {
    if (etapaAtual === 1) {
      setEtapaAtual(2);
    } else if (etapaAtual === 2) {
      const isEmpty = Object.values(actionServiceValues).every(
        value => value === false || value === '',
      );
      if (isEmpty) {
        return Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Aviso',
          textBody: 'Selecione no mínimo um procedimento executado!',
          button: 'Fechar',
        });
      }
      setEtapaAtual(3);
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

  async function getEventParticipant() {
    try {
      if (eventEducationalId) {
        setLoading(true);
        setActionServices([]);

        const eventService = await api.getCreateEvent(eventEducationalId);

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

        setActionServices(eventService.data.actionPlanServices);
      }
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setHeaderOptions(navigation, {
      headerTitle: 'Atendimento',
      headerTitleStyle: { fontFamily: 'Arial', fontSize: 14, color: '#FFF' },
      headerTintColor: '#FFF',
      headerStyle: { backgroundColor: '#37C064' },
    });
    loadStorage();
    getEventParticipant();
  }, [navigation]);

  const renderEtapa = () => {
    if (etapaAtual === 1) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>HISTÓRICO MÉDICO</Text>

          <View style={styles.checkboxRow}>
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
            style={styles.input}
            placeholder="Descreva suas alergias..."
            value={alergiasText}
            onChangeText={setAlergiasText}
            editable={alergiasChecked}
            multiline
          />

          <View style={styles.checkboxRow}>
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
            style={styles.input}
            placeholder="Descreva os medicamentos..."
            value={medicamentosText}
            onChangeText={setMedicamentosText}
            editable={medicamentosChecked}
            multiline
          />

          <View style={styles.checkboxRow}>
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
            style={styles.input}
            placeholder="Descreva as condições médicas..."
            value={condicoesText}
            onChangeText={setCondicoesText}
            editable={condicoesChecked}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, { marginTop: 40 }]}
            onPress={() => avancarEtapa()}
          >
            <Text style={styles.buttonText}>AVANÇAR</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (etapaAtual === 2) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>PROCEDIMENTOS2</Text>
          {actionServices.map(item => (
            <View key={item.id}>
              {item.mandatory_value === '1' && (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleCheckboxChange(item.id)}
                >
                  <View style={styles.cardContent}>
                    <TouchableOpacity
                      onPress={() => handleCheckboxChange(item.id)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {actionServiceValues[item.id] ? (
                        <CheckboxFill color="#00A859" />
                      ) : (
                        <Checkbox color="#333" />
                      )}
                    </TouchableOpacity>

                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}

              {item.mandatory_value != '1' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{item.name}</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={value =>
                      handleTextInputChange(item.id, value)
                    }
                    value={actionServiceValues[item.id]}
                  />
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => stopEtapa()}
          >
            <Text style={styles.buttonText}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => avancarEtapa()}
          >
            <Text style={styles.buttonText}>AVANÇAR</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (etapaAtual === 3) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>OBSERVAÇÂO</Text>
          <TextInput
            style={[styles.inputArea, styles.multilineInput]}
            multiline={true}
            numberOfLines={4}
            value={descritionText}
            onChangeText={setDescritionText}
            placeholder="Descreva a observação..."
          />

          <View style={styles.specialistOptionContainer}>
            <View style={styles.specialistTextContainer}>
              <Text style={styles.specialistText}>
                Necessita de atuação de especialista?
              </Text>
              <Text style={styles.specialistDescription}>
                Marque esta opção se foi identificado a necessidade de
                encaminhamento para um especialista.
              </Text>
            </View>
            <Switch
              value={isSpecialistRequired}
              onValueChange={() =>
                setIsSpecialistRequired(!isSpecialistRequired)
              }
              color="#37C064"
            />
          </View>
          <Text style={styles.sectionTitle}>INTERCORRÊNCIA (SE HOUVER)</Text>
          <TextInput
            style={[styles.inputArea, styles.multilineInput]}
            value={specialistText}
            onChangeText={setSpecialistText}
            multiline={true}
            numberOfLines={4}
            editable={isSpecialistRequired}
            placeholder="Descreva a intercorrência"
          />

          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => stopEtapa()}
          >
            <Text style={styles.buttonText}>VOLTAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={!isStore ? handleStore : null}
            disabled={isStore}
          >
            {loading ? (
              <ActivityIndicator size={20} color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>FINALIZAR ATENDIMENTO</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
    <>
      <Toolbar
        title="Dados do Participante"
        iconColor="#2e2e2eff"
        titleColor="#535353ff"
        onNavigate={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        enableOnAndroid={true}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LoadingInfo visible={loading} message="Salvando as informações" />

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
    backgroundColor: '#ffffffff',
    padding: 10,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#535353ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 48,
  },
  inputArea: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#454652',
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
  titleName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginBottom: 5,
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    color: '#454652',
  },
  card: {
    borderColor: '#333',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#454652',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 0,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 2,
    color: '#333',
  },
  button: {
    backgroundColor: '#37C064',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonBack: {
    backgroundColor: '#37C064',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  specialistOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  specialistTextContainer: {
    flex: 1,
    marginLeft: 5,
  },
  specialistText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialistDescription: {
    fontSize: 12,
    color: '#777',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRodape: {
    backgroundColor: '#37C064',
    padding: 10,
    borderRadius: 4,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginBottom: 5,
  },
});
