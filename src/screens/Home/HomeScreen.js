import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import CardEvent from '../../components/ui/CardEvent';
import CardNotEvent from '../../components/ui/CardNotEvent';
import MonthCarousel from '../../components/ui/MonthCarousel';
import Header from '../../components/ui/Header';
import { dataAtual } from '../../utils/date';
import api from './../../services/endpont';

// Componentes reutilizáveis
const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export default function Home() {
  const dateNow = dataAtual();
  const [monthlyEventCounts, setMonthlyEventCounts] = useState({});

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [educationalEvents, setEducationalEvents] = useState([]);
  const scrollRef = useRef(null);

  function updatedMonth(index) {
    setSelectedMonth(index);
    setEducationalEvents([]);

    const year = new Date().getFullYear();
    const firstDayOfMonth = new Date(year, index, 1);

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
    const currentMonthIndex = new Date().getMonth();
    setSelectedMonth(currentMonthIndex);
    getEvents(dateNow);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: currentMonthIndex * 60 - 120,
          animated: true,
        });
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

      <MonthCarousel
        displayMonthIndex={selectedMonth}
        onMonthChange={updatedMonth}
        monthlyEventCounts={monthlyEventCounts}
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  monthSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#ffffffff',
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
    backgroundColor: '#ffffffff',
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
    fontSize: 13,
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
