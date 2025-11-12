import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';
import Toolbar from '../../components/ui/Toolbar';
import api from './../../services/endpont';
import { formatFone } from '../../utils/formatInput';
import Loading from '../../components/ui/Loading';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import SearchBarWithFilters from '../../components/ui/SearchBarWithFilters';

import {
  ArrowDownIcon,
  EyeIcon,
  ToothIcon,
  MedicalBagIcon,
  ScissorsIcon,
  MakeupBrushIcon,
  GlassesIcon,
  SharpMoreVert,
  CancelIcon,
  CheckIcon,
} from '../../components/Icons/Icons';

const isBeforeToday = dateString => {
  if (!dateString) return false; // Não podemos comparar

  const eventDate = new Date(dateString);
  const today = new Date();

  // Cria uma data UTC para o início do dia do evento
  const eventDateUTC = new Date(
    Date.UTC(
      eventDate.getUTCFullYear(),
      eventDate.getUTCMonth(),
      eventDate.getUTCDate(),
    ),
  );

  // Cria uma data UTC para o início do dia de hoje
  const todayDateUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  // Retorna true se a data do evento (UTC) for < data de hoje (UTC)
  return eventDateUTC.getTime() < todayDateUTC.getTime();
};

const statusConfig = {
  Realizada: { color: '#00A859', label: 'Realizada' },
  'Em Atendimento': { color: '#007BFF', label: 'Em Atendimento' },
  Desistência: { color: '#DC3545', label: 'Desistência' },
  Aguardando: { color: '#f78020ff', label: 'Aguardando' },
  Preferencial: { color: '#20a8f7ff', label: 'Preferencial' },
};

const normalize = name => name.toUpperCase().trim();

const categoryIcons = {
  OFTALMOLOGIA: <EyeIcon />,
  ODONTOLOGIA: <ToothIcon />,
  ENFERMAGEM: <MedicalBagIcon />,
  BARBEARIA: <ScissorsIcon />,
  'CORTE DE CABELO': <ScissorsIcon />,
  MAQUIAGEM: <MakeupBrushIcon />,
  'ENTREGA DE ÓCULOS': <GlassesIcon />,
  'ATENDIMENTO DE BELEZA': <MakeupBrushIcon />,
};

const categoryDisplayNames = {
  'ATENDIMENTO DE BELEZA': 'BELEZA',
  // 'OUTRO NOME LONGO DO BACKEND': 'NOME CURTO'
};

export default function Service() {
  const navigation = useNavigation();
  const route = useRoute();
  const isFirstRender = useRef(true);

  const { eventId, dateEvent, status } = route.params || {};
  const eventoJaOcorreu = new Date(dateEvent) < new Date();
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSectionVisible, setSectionVisible] = useState([]);
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [eventEducationalId, setEventEducationalId] = useState(null);
  const [sequential, setSequential] = useState(null);
  const isLocked = status === 'Em execução' && isBeforeToday(dateEvent);
  const [educationalEvents, setEducationalEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [states, setStates] = useState([]);
  const [priorities, setPriorities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [renderingSectionIndex, setRenderingSectionIndex] = useState(null);
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

  const podeGerarRelatorio = status === 'Fechamento';

  useEffect(() => {
    if (educationalEvents.length > 0 && isSectionVisible.length === 0) {
      const initialVisibility = educationalEvents.map(() => false);
      setSectionVisible(initialVisibility);
    }
  }, [educationalEvents.length]);
  const toggleSection = index => {
    const isOpening = !isSectionVisible[index];

    if (isOpening) {
      setRenderingSectionIndex(index);

      setTimeout(() => {
        setSectionVisible(prev =>
          prev.map((visible, i) => (i === index ? !visible : visible)),
        );
        setRenderingSectionIndex(null);
      }, 50);
    } else {
      setSectionVisible(prev =>
        prev.map((visible, i) => (i === index ? !visible : visible)),
      );
    }
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
    setIsAttend((situation == 1 || situation == 2) && !isLocked);
    setCancel(situation > 3 || isLocked);
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

    const statusToId = {
      Aguardando: 1,
      Realizada: 3,
      Desistência: 4,
      'Atendimento Preferencial': 1,
    };

    const situationIds = selectedSituations.map(s => statusToId[s]);

    try {
      const services = await api.patchEventsServices(
        eventId,
        searchName,
        situationIds,
      );

      if (!services.error) {
        setIsInstrutor(services.data.isInstrutor);
        setIsCreateEvent(services.data.isCreateEvent);

        let data = services.data.eventServices;

        // ✅ filtra localmente os "Preferenciais"
        if (selectedSituations.includes('Atend. Preferencial')) {
          data = data.filter(
            item => item.situation === 1 && item.prioritie_id > 1,
          );
        }

        setEducationalEvents(data);
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
        visibleRegister={!loading && isCreateEvent && !isLocked}
      />

      {loading ? (
        <Loading message="Carregando informações..." />
      ) : (
        <>
          <SearchBarWithFilters
            searchValue={searchName}
            onSearchChange={text => setSearchName(text)}
            onSearchSubmit={() => handleGetEvents()}
            selectedStatuses={selectedSituations}
            onStatusChange={setSelectedSituations}
            filterConfig={{
              modalTitle: 'Filtros',
              statusSubtitle: 'Status do Atendimento',
              applyButtonText: 'Aplicar',
              onApply: () => handleGetEvents(),
            }}
          />
          <ScrollView>
            {educationalEvents.map((client, index) => {
              const normalizedName = normalize(client.name);
              const icon = categoryIcons[normalizedName] || <CancelIcon />;
              const displayName =
                categoryDisplayNames[normalizedName] || normalizedName;

              console.log(
                `Serviço: ${client.name}, Participantes:`,
                client.participants?.length,
              );

              return (
                <View key={client.event_id} style={styles.categoryWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.categoryHeader,
                      isSectionVisible[index] && styles.categoryHeaderExpanded,
                    ]}
                    onPress={() => toggleSection(index)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.headerLeft}>
                      <View style={styles.iconContainer}>{icon}</View>

                      <Text style={styles.categoryTitle}>{displayName} - </Text>

                      <Text style={styles.categoryCount}>
                        {client.participants.length} Atendimentos
                      </Text>
                    </View>
                    <ArrowDownIcon isExpanded={isSectionVisible[index]} />
                  </TouchableOpacity>

                  {renderingSectionIndex === index && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#00A859" />
                    </View>
                  )}

                  {isSectionVisible[index] &&
                    renderingSectionIndex !== index && (
                      <View style={styles.itemList}>
                        {client.participants.map((participant, partIndex) => {
                          const situationLabel =
                            situationsMaps[participant.situation] ||
                            'Indefinido';
                          const currentStatus = statusConfig[
                            situationLabel
                          ] || {
                            color: '#6c757d',
                            label: 'Indefinido',
                          };

                          const situationText =
                            participant.situation == 1 &&
                            participant.prioritie_id > 1
                              ? 'Aten. Preferencial'
                              : currentStatus.label;

                          const statusColor =
                            participant.situation == 1 &&
                            participant.prioritie_id > 1
                              ? statusConfig['Preferencial'].color
                              : currentStatus.color;

                          return (
                            <TouchableOpacity
                              key={participant.id}
                              style={[
                                styles.itemCard,
                                { borderLeftColor: statusColor },
                              ]}
                              onPress={() =>
                                openModal(
                                  participant.id,
                                  participant.first_name,
                                  participant.sexo,
                                  participant.situation,
                                  participant.sequential,
                                )
                              }
                              activeOpacity={0.7}
                            >
                              <View style={styles.itemHeader}>
                                <Text style={styles.itemName} numberOfLines={1}>
                                  #{participant.sequential} -{' '}
                                  {participant.first_name}
                                </Text>
                                <TouchableOpacity
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
                                  <SharpMoreVert />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.itemBody}>
                                <View style={styles.itemColumn}>
                                  <Text style={styles.itemLabel}>
                                    CPF:{' '}
                                    <Text style={styles.itemValue}>
                                      {participant.cpf}
                                    </Text>
                                  </Text>
                                  <Text style={styles.itemLabel}>
                                    Contato:{' '}
                                    <Text style={styles.itemValue}>
                                      {formatFone(participant.number)}
                                    </Text>
                                  </Text>
                                </View>
                                <View style={styles.itemColumn}>
                                  <Text style={styles.itemLabel}>
                                    Sexo:{' '}
                                    <Text style={styles.itemValue}>
                                      {participant.sexo}
                                    </Text>
                                  </Text>
                                  <Text style={styles.itemLabel}>
                                    Situação:{' '}
                                    <Text
                                      style={[
                                        styles.itemValue,
                                        {
                                          color: statusColor,
                                          fontFamily: 'Ubuntu-Bold',
                                        },
                                      ]}
                                    >
                                      {situationText}
                                    </Text>
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  Atendimento #{sequential} - {nameCordial} {name}
                </Text>

                <Text style={styles.actionsTitle}>Ações Disponíveis</Text>

                {!isCancel && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleAction('cancel')}
                  >
                    <CancelIcon />
                    <Text
                      style={[styles.actionButtonText, styles.cancelButtonText]}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, styles.detailsButton]}
                  onPress={() => handleAction('view')}
                >
                  <EyeIcon color="#333" />
                  <Text
                    style={[styles.actionButtonText, styles.detailsButtonText]}
                  >
                    Visualizar
                  </Text>
                </TouchableOpacity>

                {isAttend && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.attendButton]}
                    onPress={() => handleAction('attend')}
                  >
                    <CheckIcon />
                    <Text
                      style={[styles.actionButtonText, styles.attendButtonText]}
                    >
                      Atender
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {podeGerarRelatorio && (
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() =>
            navigation.navigate('Relatorio', { eventId, dateEvent })
          }
        >
          <Text style={styles.reportBtnText}>Gerar Relatório</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  categoryWrapper: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  reportBtn: {
    backgroundColor: '#009B53',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 80,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  reportBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 9,
  },
  filterWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  categoryHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#E1FFEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#333',
  },
  categoryCount: {
    fontWeight: 'normal',
    fontSize: 13,
    color: '#00A859',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemList: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  itemCard: {
    height: 81,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    elevation: 3,
    paddingLeft: 8,
    paddingTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffffffff',
    borderLeftWidth: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontWeight: 'normal',
    color: '#343A40',
    flex: 1,
  },
  itemBody: {
    flexDirection: 'row',
  },
  itemColumn: {
    flex: 1,
  },
  itemLabel: {
    fontWeight: 'normal',
    fontSize: 12,
    color: '#424242ff',
    marginBottom: 4,
  },
  itemValue: {
    fontWeight: '400',
    color: '#3f3f3fff',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontWeight: 'normal',
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
  },

  actionsTitle: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },

  actionButtonText: {
    fontWeight: 'normal',
    fontSize: 14,
    marginLeft: 10,
  },

  attendButton: {
    backgroundColor: '#00A859',
    borderColor: '#00A859',
  },

  attendButtonText: {
    color: '#FFFFFF',
  },

  detailsButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CED4DA',
  },

  detailsButtonText: {
    color: '#4A5568',
  },

  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DC3545',
  },

  cancelButtonText: {
    color: '#DC3545',
  },
});
