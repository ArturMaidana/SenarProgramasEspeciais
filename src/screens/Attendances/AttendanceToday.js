import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import TodayCard from '../../components/ui/TodayCard';
import api from '../../services/endpont';
import Loading from '../../components/ui/Loading';
import { formatDate } from '../../utils/dateFormat';
import { dataAtual } from '../../utils/date';
import { s, vs, ms } from 'react-native-size-matters';

export default function AttendanceToday({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [runningEvents, setRunningEvents] = useState([]);

  const intervalRef = useRef(null);

  const handleCardPress = event => {
    navigation.navigate('Atendimentos', {
      eventId: event.id,
      dateEvent: event.started_at,
    });
  };

  const dateNow = dataAtual();

  const loadTodayEvents = useCallback(async () => {
    try {
      const response = await api.getEventsAtendeDate(dateNow);

      const events = response.data || [];

      const executing = events.filter(ev => ev.status === 'Em execução');

      setRunningEvents(executing);
    } catch (error) {
      console.log('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayEvents();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => loadTodayEvents(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [loadTodayEvents]);

  if (loading) return <Loading message="Carregando eventos..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Text style={styles.title}>
          Confira os mutirões rurais em execução neste momento.
        </Text>

        <ScrollView style={styles.scrollcontainer}>
          {runningEvents.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum mutirão em execução hoje.
            </Text>
          )}

          {runningEvents.map(event => {
            const textoDescricao = `Aviso aos cidadãos de ${event.city}: Vai acontecer um mutirão rural, aproveite a oportunidade para regularizar sua situação; fique atento à data!`;

            return (
              <TodayCard
                key={event.id}
                tagText="Mutirão Rural"
                idText={`${event.city} - ${formatDate(event.started_at)}`}
                location={textoDescricao}
                date={event.start_time}
                statusText="Em Execução"
                onPress={() => handleCardPress(event)}
              />
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContentContainer: {
    paddingHorizontal: s(15),
    paddingBottom: vs(120),
    paddingTop: vs(35),
  },
  title: {
    fontSize: ms(19),
    fontWeight: 'normal',
    color: '#333',
  },
  scrollcontainer: {
    padding: ms(2),
    marginTop: vs(10),
  },
  emptyText: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#555',
  },
});
