import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ClockIcon } from '../Icons/Icons';

const CardNotEvent = () => {
  return (
    <View style={styles.body}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <ClockIcon
            name="info"
            size={32}
            color="#37C064"
            style={{ marginTop: 5 }}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardDescription}>
              Nenhum evento para esse período...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CardNotEvent;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 0,
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B9348',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  // Estilos do CardEvent
  eventContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: '#37C064',
    fontFamily: 'Ubuntu',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 12,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 8,
    color: '#333',
    fontFamily: 'Ubuntu',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
  },
  dateStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    color: '#022723',
    fontFamily: 'Ubuntu',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
  },
  statusText: {
    color: '#007C6F',
    fontFamily: 'Ubuntu',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 12,
    textTransform: 'uppercase',
  },
});
