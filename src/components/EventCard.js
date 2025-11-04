// src/components/EventCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  CalendarIcon,
  PinIcon,
  ArrowRightIcon,
} from '../components/Icons/Icons';

export default function EventCard({
  tagText,
  idText,
  location,
  date,
  statusText,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{tagText}</Text>
        </View>
        <Text style={styles.idText} numberOfLines={1}>
          {idText}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <PinIcon width={16} style={styles.icon} />
          <Text style={styles.infoText}>{location}</Text>
        </View>
        <View style={styles.infoRow}>
          <CalendarIcon width={16} style={styles.icon} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>{statusText}</Text>
        <ArrowRightIcon width={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    backgroundColor: '#00A859',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  tagText: {
    fontFamily: 'Ubuntu-Bold',
    color: '#FFFFFF',
    fontSize: 12,
  },
  idText: {
    flex: 1,
    fontFamily: 'Ubuntu-Bold',
    fontSize: 12,
    color: '#363636',
  },
  infoSection: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 12,
    color: '#555555',
  },
  statusRow: {
    marginTop: -18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Ubuntu-Bold',
    color: '#00A859',
    fontSize: 12,
    marginRight: 4,
  },
});
