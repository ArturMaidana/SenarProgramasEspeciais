// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import EventCard from '../../components/EventCard';
import CardEvent from '../../components/ui/CardEvent';
import GlobalSearchBar from '../../components/ui/GlobalSearchBar';
import MonthCarousel from '../../components/ui/MonthCarousel';
import NotificationModal from '../../components/Moldals/NotificationModal';
import { s, vs, ms } from 'react-native-size-matters';
import { NotificationIcon } from '../../components/Icons/Icons';

import {
  fetchApiData,
  fetchUserData,
  getCurrentLocation,
  mockEventsData,
  mockNotifications,
} from '../../utils/HomeScreenMocks';

const parseLocalDate = dateString => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day);
};

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Carregando...');
  const [userAvatar, setUserAvatar] = useState(null);
  const [location, setLocation] = useState('Buscando localização...');
  const [displayMonthIndex, setDisplayMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [monthlyEventCounts, setMonthlyEventCounts] = useState(
    Array(12).fill(0),
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await fetchUserData();
        const userLocation = await getCurrentLocation();
        setUserName(userData.name);
        setUserAvatar({ uri: userData.avatarUrl });
        setLocation(`${userLocation.city}, ${userLocation.state}`);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setUserName('Visitante');
      }
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    try {
      const counts = Array(12).fill(0);
      mockEventsData.forEach(event => {
        const eventDate = parseLocalDate(event.date);
        if (eventDate) {
          const month = eventDate.getMonth();
          if (month >= 0 && month < 12) {
            counts[month]++;
          }
        }
      });
      setAllEvents(mockEventsData);
      setMonthlyEventCounts(counts);
    } catch (error) {
      console.error('Erro ao processar os eventos:', error);
    }
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) {
      const eventsForMonth = allEvents.filter(event => {
        const eventDate = parseLocalDate(event.date);
        return eventDate && eventDate.getMonth() === displayMonthIndex;
      });
      setFilteredEvents(eventsForMonth);
    }
  }, [displayMonthIndex, allEvents]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async query => {
    setIsSearching(true);
    const results = await fetchApiData(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleResultSelect = result => {
    setSearchQuery('');
    setSearchResults([]);
    if (result.navigation) {
      navigation.navigate(result.navigation, { id: result.id });
    }
  };

  const handleCardPress = id => navigation.navigate('Atendimentos', { id });

  const formatDateForDisplay = dateString => {
    const date = parseLocalDate(dateString);
    if (!date) return 'Data inválida';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.staticHeader}>
          <View style={styles.header}>
            <Image style={styles.avatar} source={userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Bem-vindo, {userName}</Text>
              <Text style={styles.locationText}>{location}</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => setModalVisible(true)}
            >
              <NotificationIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchPlaceholder} />

          <MonthCarousel
            displayMonthIndex={displayMonthIndex}
            monthlyEventCounts={monthlyEventCounts}
            onMonthChange={setDisplayMonthIndex}
          />

          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                tagText={event.tagText}
                idText={event.idText}
                location={event.location}
                date={formatDateForDisplay(event.date)}
                statusText={event.statusText}
                onPress={() => handleCardPress(event.id)}
              />
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>
                Nenhum evento para este mês.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.floatingSearchWrapper}>
          <GlobalSearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onResultSelect={handleResultSelect}
            searchResults={searchResults}
            isLoading={isSearching}
          />
        </View>
        <NotificationModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          notifications={mockNotifications}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  staticHeader: {
    paddingTop: vs(35),
    paddingHorizontal: s(10),
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: s(15),
    paddingBottom: vs(100),
  },
  floatingSearchWrapper: {
    position: 'absolute',
    top: vs(95),
    left: s(10),
    right: s(10),
    zIndex: 10,
  },
  searchPlaceholder: {
    height: vs(30),
    marginBottom: vs(10),
  },
  avatar: {
    width: s(50),
    height: s(50),
    borderRadius: ms(100),
    backgroundColor: '#E0E0EE',
    borderWidth: ms(2),
    borderColor: '#00A859',
  },
  userInfo: {
    flex: 1,
    marginLeft: s(15),
  },
  welcomeText: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(16),
    color: '#212121',
  },
  locationText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(13),
    color: '#757575ff',
  },
  notificationButton: {
    padding: ms(13),
    backgroundColor: '#FFFFFF',
    borderRadius: ms(5),
    elevation: ms(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: vs(1) },
    shadowOpacity: 0.2,
    shadowRadius: ms(1.41),
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(40),
  },
  noEventsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#757575',
  },
});
