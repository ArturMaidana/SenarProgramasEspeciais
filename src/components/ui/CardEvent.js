import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../../utils/dateFormat';

import { CalendarIcon, ArrowRightIcon, PinIcon } from '../Icons/Icons';

const STATUS_STYLES = {
  Fechamento: {
    color: '#ff2727ff',
  },
  'Em execução': {
    color: '#277dffff',
  },
  Programado: {
    color: '#6c757d',
  },
  'Em preenchimento': {
    color: '#6c757d',
  },
};

const CardEvent = ({ eventId, title, dateEvent, location, date, status }) => {
  const navigation = useNavigation();

  const currentStatusStyle = STATUS_STYLES[status] || STATUS_STYLES.default;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('Atendimentos', { eventId, dateEvent })
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.infoRow}>
          <View style={styles.iconWrap}>
            <PinIcon width={16} height={16} />
          </View>
          <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
            <Text style={styles.textlabel}>Local: </Text>
            {location}
          </Text>
        </View>
        <View style={[styles.infoRow, { marginBottom: 0 }]}>
          <View style={styles.iconWrap}>
            <CalendarIcon width={16} height={16} />
          </View>
          <Text style={styles.infoText}>
            <Text style={styles.textlabel}>Data: </Text>
            {formatDate(date)}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.status, currentStatusStyle]}>{status}</Text>
          <ArrowRightIcon width={16} height={16} style={currentStatusStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    backgroundColor: '#ffffffff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textlabel: {
    fontWeight: '800',
  },
  headerText: {
    fontWeight: '600',
    color: '#009b53ff',
    fontSize: 14.5,
    marginBottom: -5,
  },
  bodyContainer: {
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12, // antes era 8
    color: '#555555',
  },
  iconWrap: {
    marginRight: 5, // espaçamento entre ícone e texto
    alignItems: 'center', // alinha verticalmente com o texto
    justifyContent: 'center',
  },
  infoText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#555555',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -10,
  },
  status: {
    fontWeight: '900',
    fontSize: 12,
  },
});

export default CardEvent;
