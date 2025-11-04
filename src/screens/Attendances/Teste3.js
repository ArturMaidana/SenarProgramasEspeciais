import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

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
import SearchBarWithFilters from '../../components/SearchBarWithFilters';
import { ArrowDownIcon, ArrowRightIcon } from '../../components/Icons/Icons';

export default function Service() {
  const navigation = useNavigation();
  const route = useRoute();
  const isFirstRender = useRef(true);

  const { eventId, dateEvent } = route.params || {};
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchValue, setSearchValue] = useState('');
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

  const toggleFilters = () => setFiltersVisible(prev => !prev);

  const handleCheckboxChange = id => {
    setSelectedSituations(prevSelectedIds =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter(item => item !== id)
        : [...prevSelectedIds, id],
    );
  };

  const handleSearchChange = text => {
    setSearchValue(text);
  };

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

  const closeModal = () => setModalVisible(false);

  const handleAction = action => {
    closeModal();

    if (action === 'cancel') {
      Alert.alert(
        'Confirmação',
        `Tem certeza que deseja excluir o atendimento do participante ${name}?`,
        [
          { text: 'Sim', onPress: () => handleYesPress() },
          { text: 'Cancelar', style: 'cancel' },
        ],
      );
    }

    if (action === 'attend') {
      setShouldFetch(false);
      navigation.navigate('CreateService', { eventEducationalId });
    }

    if (action === 'view') {
      setShouldFetch(false);
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
          setGenders(
            cidades.data.genders.map(g => ({
              label: g.description,
              value: g.id,
            })),
          );
          setStates(
            cidades.data.states.map(s => ({ label: s.name, value: s.id })),
          );
          setCities(
            cidades.data.cities.map(c => ({ label: c.name, value: c.id })),
          );
          setPriorities(
            cidades.data.priorities.map(p => ({ label: p.name, value: p.id })),
          );
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
      if (!eventsFetched) getEvents();

      if (eventsFetched) {
        getCities();
        setInitialLoadCities(false);
      }
      setShouldFetch(true);
    }
  }, [isFocused, getEvents, getCities, eventsFetched]);

  useEffect(() => {
    intervalRef.current = setInterval(() => getEvents(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [getEvents]);

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
    <View style={styles.container}>
      <Toolbar
        title="Atendimento"
        iconColor="#2e2e2eff"
        titleColor="#535353ff"
        genders={genders}
        states={states}
        cities={cities}
        priorities={priorities}
        eventId={eventId}
        onNavigate={() => setShouldFetch(false)}
        visibleRegister={!loading && isCreateEvent}
      />

      {loading ? (
        <Loading message="Carregando informações..." />
      ) : (
        <>
          <SearchBarWithFilters
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            filterConfig={{
              modalTitle: 'Filtrar Atendimentos',
              statusSubtitle: 'Status do Atendimento',
              applyButtonText: 'Aplicar Filtros',
            }}
          />

          <ScrollView>
            {/* FILTROS */}
            {/* <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={toggleFilters}
              >
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Filtros</Text>
                  <Icon
                    name="filter-list"
                    size={24}
                    color="#000"
                    style={{ marginLeft: 8 }}
                  />
                </View>

                <Icon
                  name={isFiltersVisible ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>

              {isFiltersVisible && (
                <View style={styles.item}>
                  <TextInput
                    label="Buscar pelo nome ou cpf"
                    value={searchName}
                    onChangeText={setSearchName}
                    style={styles.input}
                  />

                  <View style={styles.checkboxContainer}>
                    {Object.keys(situationsMaps).map(id => (
                      <View style={styles.checkboxWrapper} key={id}>
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
                      </View>
                    ))}
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="contained"
                      style={[styles.button, { marginRight: 10 }]}
                      onPress={handleGetEvents}
                    >
                      Filtrar Busca
                    </Button>

                    <Button
                      mode="contained"
                      style={styles.button}
                      onPress={handleClear}
                    >
                      Limpar
                    </Button>
                  </View>
                </View>
              )}
            </View> */}

            {/* LISTA DE EVENTOS */}
            {educationalEvents.map((client, index) => (
              <View key={client.event_id} style={styles.section}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(index)}
                >
                  <Text style={styles.sectionTitle}>
                    {client.name} ({client.participants.length} atendimentos)
                  </Text>

                  <ArrowDownIcon
                    name={
                      isSectionVisible[index] ? 'expand-less' : 'expand-more'
                    }
                    size={24}
                    color="#1e8344ff"
                  />
                </TouchableOpacity>

                {isSectionVisible[index] && (
                  <>
                    {client.participants.map((participant, partIndex) => (
                      <View style={styles.item} key={participant.id}>
                        <TouchableOpacity
                          style={styles.itemContent}
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
                          <Text style={styles.itemTitle}>
                            #{participant.sequential} - {participant.first_name}
                          </Text>

                          <View style={styles.itemDetailsContainer}>
                            <View style={styles.detailColumn}>
                              <Text style={styles.itemLabel}>CPF</Text>
                              <Text style={styles.itemValue}>
                                {participant.cpf}
                              </Text>
                            </View>

                            <View style={styles.detailColumn}>
                              <Text style={styles.itemLabel}>Contato</Text>
                              <Text style={styles.itemValue}>
                                {formatFone(participant.number)}
                              </Text>
                            </View>

                            <View style={styles.detailColumn}>
                              <Text style={styles.itemLabel}>Sexo</Text>
                              <Text style={styles.itemValue}>
                                {participant.sexo}
                              </Text>
                            </View>

                            <View style={styles.detailColumn}>
                              <Text style={styles.itemLabel}>Situação</Text>

                              <Text
                                style={[
                                  styles.itemSituationValue,
                                  {
                                    color:
                                      participant.situation == 1
                                        ? '#0000FF'
                                        : participant.situation == 2
                                        ? '#FACA15'
                                        : participant.situation == 3
                                        ? '#37C064'
                                        : '#E02424',
                                  },
                                ]}
                              >
                                {participant.situation == 1 &&
                                participant.prioritie_id > 1
                                  ? 'Aten. Preferencial'
                                  : mapSituation(participant.situation)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>

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
                          <ArrowRightIcon
                            name="chevron-right"
                            size={24}
                            color="#4CAF50"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <ArrowRightIcon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Atendimento: #{sequential} - {nameCordial} {name}
            </Text>

            <Text style={styles.modalSubtitle}>AÇÕES</Text>

            <View style={styles.actionsContainer}>
              {!isCancel && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction('cancel')}
                >
                  <Icon name="cancel" size={48} color="#E03F3F" />
                  <Text style={styles.actionText}>Cancelar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleAction('view')}
              >
                <Icon name="visibility" size={48} color="#F1E809" />
                <Text style={styles.actionText}>Visualizar</Text>
              </TouchableOpacity>

              {isAttend && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction('attend')}
                >
                  <Icon name="check-circle" size={48} color="#37C064" />
                  <Text style={styles.actionText}>Atender</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    padding: 10,
  },

  eventosText: {
    color: '#454652',
    fontFamily: 'Ubuntu',
    fontSize: 14,
    fontWeight: '400',
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateText: {
    marginLeft: 8,
    color: '#022723',
    fontFamily: 'Ubuntu',
    fontSize: 14,
    fontWeight: '400',
    marginRight: 15,
  },

  /* SECTIONS */
  section: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#454652',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  /* FILTROS */
  input: {
    backgroundColor: '#fafafa',
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 14,
  },

  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#37C064',
    flex: 1,
    borderRadius: 4,
  },

  /* LIST ITEMS */
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  itemDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  detailColumn: {
    marginRight: 15,
  },

  itemLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },

  itemValue: {
    fontSize: 12,
    color: '#000',
  },

  itemSituationValue: {
    fontSize: 12,
  },

  /* MODAL */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  closeButton: {
    alignSelf: 'flex-end',
  },

  modalTitle: {
    fontSize: 14,
    fontFamily: 'Ubuntu',
    fontWeight: '500',
    color: '#454652',
    textAlign: 'center',
    marginBottom: 10,
  },

  modalSubtitle: {
    fontSize: 10,
    color: '#454652',
    marginBottom: 20,
    textTransform: 'uppercase',
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  actionButton: {
    alignItems: 'center',
  },

  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
});
