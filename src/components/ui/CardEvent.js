import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../../utils/dateFormat';

import { CalendarIcon, ArrowRightIcon, PinIcon } from '../Icons/Icons';

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

const STATUS_STYLES = {
  Fechamento: {
    color: '#ff2727ff',
  },
  'Em execução': {
    color: '#277dffff',
  },
  'Execução fora de Data': {
    color: '#ff2727ff',
  },
  Programado: {
    color: '#6c757d',
  },
  'Em preenchimento': {
    color: '#6c757d',
  },
  default: {
    color: '#6c757d',
  },
};

const CardEvent = ({ eventId, title, dateEvent, location, date, status }) => {
  const navigation = useNavigation();

  // Determina o status real com base na data
  let effectiveStatus = status;
  if (status === 'Em execução' && isBeforeToday(dateEvent)) {
    effectiveStatus = 'Execução fora de Data';
  }
  // Usa o 'effectiveStatus' para estilo
  const currentStatusStyle =
    STATUS_STYLES[effectiveStatus] || STATUS_STYLES.default;

  // Lógica para encurtar o nome
  let displayStatus = effectiveStatus;
  const MAX_LENGTH = 18;

  if (!STATUS_STYLES[displayStatus] && displayStatus.length > MAX_LENGTH) {
    displayStatus = `${displayStatus.substring(0, MAX_LENGTH)}...`;
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('Atendimentos', { eventId, dateEvent, status })
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
      </View>

      <View style={styles.statusRow}>
        <Text style={[styles.status, currentStatusStyle]}>{displayStatus}</Text>
        <ArrowRightIcon width={16} height={16} style={currentStatusStyle} />
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
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
    color: '#555555',
  },
  iconWrap: {
    marginRight: 5,
    alignItems: 'center',
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
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  status: {
    fontWeight: '500',
    fontSize: 12,
    marginRight: 2,
  },
});

export default CardEvent;
