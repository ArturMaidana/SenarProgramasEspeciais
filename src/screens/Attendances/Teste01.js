import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput, Checkbox, Button } from 'react-native-paper';
import Toolbar from '../../components/ui/Toolbar';
import api from './../../services/endpont';
import { formatDate } from '../../utils/dateFormat';
import { formatFone, mapSituation } from '../../utils/formatInput';
import Loading from '../../components/ui/Loading';
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Dialog,
} from 'react-native-alert-notification';

export default function Service() {
  const navigation = useNavigation();
  const route = useRoute();
  const isFirstRender = useRef(true);
  const { eventId, dateEvent } = route.params || {};
  const [isSectionVisible, setSectionVisible] = useState([true, false, false]);
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [eventEducationalId, setEventEducationalId] = useState(null);
  const [sequential, setSequential] = useState(null);
  const [educationalEvents, setEducationalEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [states, setStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(true);
  const [nameCordial, setNameCordial] = useState(true);
  const [isAttend, setIsAttend] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [isInstrutor, setIsInstrutor] = useState(false);
  const [isCreateEvent, setIsCreateEvent] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [initialLoadCities, setInitialLoadCities] = useState(true);
  const [eventsFetched, setEventsFetched] = useState(false);
  const [hasCalledGetEvents, setHasCalledGetEvents] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedSituations, setSelectedSituations] = useState([]);
  const isFocused = useIsFocused();
  const intervalRef = useRef(null);

  const toggleSection = index => {
    setSectionVisible(prev =>
      prev.map((visible, i) => (i === index ? !visible : visible)),
    );
  };

  const toggleFilters = () => {
    setFiltersVisible(prev => !prev);
  };

  // const handleCheckboxChange = (id) => {
  // 	setSelectedSituations(prev => {
  // 		const idAsNumber = parseInt(id, 10);
  // 		if (prev.includes(idAsNumber)) {
  // 			return prev.filter(item => item !== idAsNumber);
  // 		} else {
  // 			return [...prev, idAsNumber];
  // 		}
  // 	});
  // };

  // const handleCheckboxChange = (id) => {
  //     setSelectedSituations(prev => {
  //         if (prev.includes(id)) {
  //             return prev.filter(item => item !== id);
  //         } else {
  //             return [...prev, id];
  //         }
  //     });
  // };

  const handleCheckboxChange = id => {
    setSelectedSituations(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        // Remove o ID se já estiver selecionado
        return prevSelectedIds.filter(itemId => itemId !== id);
      } else {
        // Adiciona o ID se não estiver selecionado
        return [...prevSelectedIds, id];
      }
    });
  };

  async function handleFilter() {}

  const handleClear = () => {
    setSearchName('');
    setSelectedSituations([]);
  };

  const situationsMaps = {
    1: 'Aguardando',
    2: 'Em Atendimento',
    3: 'Realizada',
    4: 'Desistência',
  };

  const openModal = (itemId, name, sexo, situation, sequential) => {
    setName(name);
    setSelectedItemId(itemId);
    setEventEducationalId(itemId);
    setSequential(sequential);
    setNameCordial(sexo === 'Feminino' ? 'Sra. ' : 'Sr. ');
    setIsAttend(situation == 1 || situation == 2);
    setCancel(situation > 3);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAction = action => {
    closeModal();
    if (action === 'cancel') {
      Alert.alert(
        'Confirmação',
        `Tem certeza que deseja excluir o atendimento do participante ${name}?`,
        [
          { text: 'Sim', onPress: () => handleYesPress() },
          { text: 'Cancelar', onPress: null, style: 'cancel' },
        ],
      );
    }
    if (action === 'attend') {
      handleNavigate();
      navigation.navigate('CreateService', { eventEducationalId });
    }
    if (action === 'view') {
      handleNavigate();
      navigation.navigate('ShowService', { eventEducationalId, priorities });
    }
  };

  async function handleYesPress() {
    try {
      const cancel = await api.deleteEventsServices(selectedItemId);
      if (cancel.error) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Erro',
          textBody: cancel.message || 'Erro desconhecido.',
          button: 'Fechar',
        });
      }
      return Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Sucesso',
        textBody: cancel.message || 'Ação realizada com sucesso.',
        button: 'Fechar',
        onPressButton: () => getEvents(),
      });
    } catch (err) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: err.message || 'Erro desconhecido.',
        button: 'Fechar',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGetEvents() {
    Dialog.hide();
    setEventsFetched(true);
    setHasCalledGetEvents(false);
    try {
      const services = await api.patchEventsServices(
        eventId,
        searchName,
        selectedSituations,
      );
      if (!services.error) {
        setIsInstrutor(services.data.isInstrutor);
        setIsCreateEvent(services.data.isCreateEvent);
        setEducationalEvents(services.data.eventServices);
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erros',
        textBody: error.message + ' Erro desconhecido.',
        button: 'Fechar',
      });
    } finally {
      setLoading(false);
    }
  }

  const getEvents = useCallback(async () => {
    if (shouldFetch) {
      handleGetEvents();
    }
  }, [shouldFetch, searchName, selectedSituations]);

  const getCities = useCallback(async () => {
    if (initialLoadCities) {
      setLoading(true);
      try {
        const cidades = await api.getCities();
        if (cidades.data.genders) {
          const genderOptions = cidades.data.genders.map(gender => ({
            label: gender.description,
            value: gender.id,
          }));
          setGenders(genderOptions);

          const statesOptions = cidades.data.states.map(state => ({
            label: state.name,
            value: state.id,
          }));
          setStates(statesOptions);

          const citiesOptions = cidades.data.cities.map(city => ({
            label: city.name,
            value: city.id,
          }));
          setCities(citiesOptions);

          const prioritieOptions = cidades.data.priorities.map(prioritie => ({
            label: prioritie.name,
            value: prioritie.id,
          }));
          setPriorities(prioritieOptions);
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Erro',
          textBody: error.message || 'Erro desconhecido.',
          button: 'Fechar',
        });
      } finally {
        setLoading(false);
      }
    }
  }, [initialLoadCities]);

  useEffect(() => {
    if (isFocused) {
      if (!eventsFetched) {
        getEvents();
      }
      if (eventsFetched) {
        getCities();
        setInitialLoadCities(false);
      }
      setShouldFetch(true);
    }
  }, [isFocused, getEvents, getCities, eventsFetched]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      getEvents();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [getEvents]);

  const handleNavigate = () => {
    setShouldFetch(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (!isFirstRender.current) {
        getEvents();
      } else {
        isFirstRender.current = false;
      }
    }, [getEvents]),
  );

  return (
    <Container>
      <Toolbar
        title="Atendimento"
        iconColor="#fff"
        borderBottomColor="#37C064"
        titleColor="#fff"
        genders={genders}
        states={states}
        cities={cities}
        priorities={priorities}
        eventId={eventId}
        onNavigate={handleNavigate}
        visibleRegister={!loading && isCreateEvent}
      />

      {loading ? (
        <Loading message="Carregando informações..." />
      ) : (
        <>
          <Row>
            <EventosText>Módulo ({educationalEvents.length})</EventosText>
            <DateContainer>
              <IconFontAwesome5 name="calendar-alt" size={14} color="#6d6d6d" />
              <DateText>{formatDate(dateEvent)}</DateText>
            </DateContainer>
          </Row>

          <ScrollView>
            <Section>
              <SectionHeader onPress={toggleFilters}>
                <SectionTitleContainer>
                  <SectionTitle>Filtros</SectionTitle>
                  <Icon
                    name="filter-list"
                    size={24}
                    color="#000"
                    style={{ marginLeft: 8 }}
                  />
                </SectionTitleContainer>
                <Icon
                  name={isFiltersVisible ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#000"
                />
              </SectionHeader>

              {isFiltersVisible && (
                <Item>
                  <View>
                    <StyledTextInput
                      label="Buscar pelo nome ou cpf"
                      value={searchName}
                      onChangeText={text => setSearchName(text)}
                    />
                    <CheckboxContainer>
                      {Object.keys(situationsMaps).map(id => (
                        <CheckboxWrapper key={id}>
                          <Checkbox
                            status={
                              selectedSituations.includes(id)
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => handleCheckboxChange(id)}
                            color="#007C6F"
                          />
                          <Text>{situationsMaps[id]}</Text>
                        </CheckboxWrapper>
                      ))}
                    </CheckboxContainer>
                    <ButtonRow>
                      <StyledButton
                        mode="contained"
                        onPress={handleGetEvents}
                        style={{ marginRight: 10 }}
                      >
                        Filtrar Busca
                      </StyledButton>
                      <StyledButton mode="contained" onPress={handleClear}>
                        Limpar
                      </StyledButton>
                    </ButtonRow>
                  </View>
                </Item>
              )}

              {/* Aqui você pode continuar com o restante da sua renderização... */}
            </Section>

            {educationalEvents.map((client, index) => (
              <Section key={client.event_id}>
                <SectionHeader onPress={() => toggleSection(index)}>
                  <SectionTitle>
                    {client.name} ({client.participants.length} atendimentos)
                  </SectionTitle>
                  <Icon
                    name={
                      isSectionVisible[index] ? 'expand-less' : 'expand-more'
                    }
                    size={24}
                    color="#000"
                  />
                </SectionHeader>
                {isSectionVisible[index] && (
                  <>
                    {client.participants.map(
                      (participant, participantIndex) => (
                        <Item key={participant.id}>
                          <ItemContent
                            onPress={() =>
                              openModal(
                                participant.id,
                                participant.first_name,
                                participant.sexo,
                                participant.situation,
                                participant.sequential,
                              )
                            }
                          >
                            <ItemTitle>
                              #{participant.sequential} -{' '}
                              {participant.first_name}
                            </ItemTitle>
                            <ItemDetailsContainer>
                              <DetailColumn>
                                <ItemLabel>CPF</ItemLabel>
                                <ItemValue>{participant.cpf}</ItemValue>
                              </DetailColumn>
                              <DetailColumn>
                                <ItemLabel>Contato</ItemLabel>
                                <ItemValue>
                                  {formatFone(participant.number)}
                                </ItemValue>
                              </DetailColumn>
                              <DetailColumn>
                                <ItemLabel>Sexo</ItemLabel>
                                <ItemValue>{participant.sexo}</ItemValue>
                              </DetailColumn>
                              <DetailColumn>
                                <ItemLabel>Situação</ItemLabel>
                                <ItemSituationValue
                                  style={{
                                    color:
                                      participant.situation == 1
                                        ? '#0000FF'
                                        : participant.situation == 2
                                        ? '#FACA15'
                                        : participant.situation == 3
                                        ? '#37C064'
                                        : '#E02424',
                                  }}
                                >
                                  {participant.situation == 1 &&
                                  participant.prioritie_id > 1
                                    ? 'Aten. Preferencial'
                                    : mapSituation(participant.situation)}
                                </ItemSituationValue>
                              </DetailColumn>
                            </ItemDetailsContainer>
                          </ItemContent>
                          <TouchableOpacity
                            onPress={() =>
                              openModal(
                                participant.id,
                                participant.first_name,
                                participant.sexo,
                                participant.situation,
                              )
                            }
                          >
                            <Icon
                              name="chevron-right"
                              size={24}
                              color="#4CAF50"
                            />
                          </TouchableOpacity>
                        </Item>
                      ),
                    )}
                  </>
                )}
              </Section>
            ))}
          </ScrollView>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ModalContainer>
          <ModalContent>
            <CloseButton onPress={closeModal}>
              <Icon name="close" size={24} color="#000" />
            </CloseButton>
            <ModalTitle>
              Atendimento: #{sequential} - {nameCordial} {name}
            </ModalTitle>
            <ModalSubtitle>AÇÕES</ModalSubtitle>
            <ActionsContainer>
              {!isCancel && (
                <ActionButton onPress={() => handleAction('cancel')}>
                  <Icon name="cancel" size={48} color="#E03F3F" />
                  <ActionText>Cancelar</ActionText>
                </ActionButton>
              )}
              <ActionButton onPress={() => handleAction('view')}>
                <Icon name="visibility" size={48} color="#F1E809" />
                <ActionText>Visualizar</ActionText>
              </ActionButton>
              {isAttend && (
                <ActionButton onPress={() => handleAction('attend')}>
                  <Icon name="check-circle" size={48} color="#37C064" />
                  <ActionText>Atender</ActionText>
                </ActionButton>
              )}
            </ActionsContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

// Estilizações usando styled-components
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const SectionTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Section = styled.View`
  margin: 10px 20px;
  border-radius: 8px;
  background-color: #fff;
  padding: 10px;
`;

const SectionHeader = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

const SectionTitle = styled.Text`
  color: #454652;
  font-family: Ubuntu;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  text-transform: uppercase;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  background-color: #37c064;
  flex: 1;
  margin-right: 5px; /* Espaçamento entre os botões */
  border-radius: 4px;
`;

const StyledTextInput = styled(TextInput).attrs({
  theme: {
    colors: {
      primary: '#007C6F', // Cor da linha e do texto do TextInput
      placeholder: '#007C6F', // Cor do texto de placeholder
    },
  },
})`
  background-color: #fafafa; /* Cor de fundo do TextInput */
  margin-bottom: 10px;
  width: 100%; /* Ocupa toda a largura disponível */
  padding: 0px; /* Adiciona algum preenchimento interno */
  border-radius: 4px; /* Adiciona bordas arredondadas, se necessário */
  font-size: 14px; /* Ajusta o tamanho da fonte */
`;

const CheckboxContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CheckboxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 48%; /* Aproximadamente meio a meio */
  margin-bottom: 10px;
`;

const Item = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const ItemContent = styled.TouchableOpacity`
  flex: 1;
`;

const ItemDetailsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  margin-top: 4px;
`;

const DetailColumn = styled.View`
  margin-right: 15px;
`;

const ItemLabel = styled.Text`
  font-size: 12px;
  color: #666;
  font-weight: bold;
`;

const ItemValue = styled.Text`
  font-size: 12px;
  color: #000;
`;

const ItemSituationValue = styled.Text`
  font-size: 12px;
  color: #000;
`;

const RedText = styled.Text`
  color: red;
`;

const ItemTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
`;

const ModalTitle = styled.Text`
  font-size: 14px;
  font-family: 'Ubuntu';
  color: '#454652';
  font-weight: 500;
  margin-bottom: 10px;
  text-align: center;
`;

const ModalSubtitle = styled.Text`
  font-size: 10px;
  color: #454652;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const ActionButton = styled.TouchableOpacity`
  align-items: center;
`;

const ActionText = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: #333;
`;

const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateText = styled.Text`
  margin-left: 8px;
  color: #022723;
  font-family: Ubuntu;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin-right: 15px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 15px;
  padding: 10px;
`;

const EventosText = styled.Text`
  color: #454652;
  font-family: Ubuntu;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;
