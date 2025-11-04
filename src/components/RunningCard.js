// src/components/RunningCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ArrowRightIcon, NotificationIcon } from './Icons/Icons';

export default function RunningCard({
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
          <Text style={styles.infoText}>{location}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.dateContainer}>
          <NotificationIcon style={styles.icon} />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
          <ArrowRightIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: ms(15),
    elevation: 4,
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
    borderRadius: ms(8),
    paddingVertical: ms(4),
    paddingHorizontal: ms(10),
    marginRight: ms(5),
  },
  tagText: {
    fontFamily: 'Ubuntu-Medium',
    color: '#FFFFFF',
    fontSize: ms(12),
  },
  idText: {
    flex: 1,
    fontFamily: 'Ubuntu-Medium',
    fontSize: ms(12),
    color: '#333',
  },
  infoSection: {
    marginTop: ms(5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(5),
  },

  infoText: {
    fontFamily: 'Ubuntu-Light',
    fontSize: ms(12),
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(5),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Ubuntu-Medium',
    color: '#00A859',
    fontSize: ms(12),
    marginRight: ms(4),
  },
});
