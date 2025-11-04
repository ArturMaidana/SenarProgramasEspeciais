import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import CardEvent from '../../components/CardEvent';
import CardNotEvent from '../../components/CardNotEvent';
import Header from '../../components/Header';
import { dataAtual } from '../../utils/date';
import api from './../../services/endpont';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#000',
  },
  monthSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#F6F6F6',
    maxHeight: 80,
  },
  monthButton: {
    marginRight: 10,
    padding: 10,
    borderRadius: 50,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonActive: {
    backgroundColor: '#07814f',
  },
  monthButtonInactive: {
    backgroundColor: '#E6E6E6',
  },
  monthText: {
    fontSize: 16,
  },
  monthTextActive: {
    color: '#ffffff',
  },
  monthTextInactive: {
    color: '#000',
  },
  eventosText: {
    color: '#454652',
    fontFamily: 'Ubuntu',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
  },
  programadosText: {
    color: '#7C7A80',
    fontFamily: 'Ubuntu',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 10,
  },
  spacer: {
    width: 5,
  },
  scrollViewContent: {
    padding: 16,
  },
});

// Componentes reutilizáveis
const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const MonthSelector = ({ children, ...props }) => (
  <ScrollView
    style={styles.monthSelector}
    horizontal
    showsHorizontalScrollIndicator={false}
    {...props}
  >
    {children}
  </ScrollView>
);

const MonthButton = ({ active, onPress, children }) => (
  <TouchableOpacity
    style={[
      styles.monthButton,
      active ? styles.monthButtonActive : styles.monthButtonInactive,
    ]}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const MonthText = ({ active, children }) => (
  <Text
    style={[
      styles.monthText,
      active ? styles.monthTextActive : styles.monthTextInactive,
    ]}
  >
    {children}
  </Text>
);

const EventosText = ({ children }) => (
  <Text style={styles.eventosText}>{children}</Text>
);

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

export default function Home() {
  const dateNow = dataAtual();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [educationalEvents, setEducationalEvents] = useState([]);
  const scrollRef = useRef(null);

  // Função para atualizar o mês selecionado e logar a data
  function updatedMonth(index) {
    setSelectedMonth(index);
    setEducationalEvents([]);

    // Cria um novo objeto Date para o primeiro dia do mês selecionado
    const year = new Date().getFullYear();
    const firstDayOfMonth = new Date(year, index, 1);

    // Formata a data no formato desejado (YYYY-MM-DD)
    const formattedDate = `${firstDayOfMonth.getFullYear()}-${String(
      firstDayOfMonth.getMonth() + 1,
    ).padStart(2, '0')}-01`;

    getEvents(formattedDate);
  }

  async function getEvents(date) {
    const educationalEvents = await api.getEventsAtendeDate(date);
    setEducationalEvents(educationalEvents.data);
  }

  useEffect(() => {
    const currentMonthIndex = new Date().getMonth(); // Obtém o índice do mês atual (0-11)
    setSelectedMonth(currentMonthIndex); // Define o mês atual como selecionado
    getEvents(dateNow);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: currentMonthIndex * 60 - 120,
          animated: true,
        }); // Centraliza o mês atual no ScrollView
      }
    }, 100);
  }, []);

  const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ];

  return (
    <Container>
      <Header />
      <Row>
        <EventosText>Eventos</EventosText>
      </Row>
      <MonthSelector ref={scrollRef}>
        {months.map((month, index) => (
          <MonthButton
            key={index}
            active={index === selectedMonth}
            onPress={() => updatedMonth(index)}
          >
            <MonthText active={index === selectedMonth}>{month}</MonthText>
          </MonthButton>
        ))}
      </MonthSelector>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {educationalEvents.length > 0 ? (
          educationalEvents.map(event => (
            <CardEvent
              key={event.id}
              eventId={event.id}
              title={event.name}
              dateEvent={event.started_at}
              location={event.city}
              date={event.started_at}
              status={event.status}
            />
          ))
        ) : (
          <CardNotEvent />
        )}
      </ScrollView>
    </Container>
  );
}
