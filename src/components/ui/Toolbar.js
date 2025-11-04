import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BackPage, UserAddLine } from '../Icons/Icons';

const Toolbar = ({
  title = 'Esqueceu sua senha?',
  borderBottomColor = '#FFF',
  iconColor = '#333333',
  titleColor = '#333333',
  genders = [],
  states = [],
  cities = [],
  priorities = [],
  eventId = '',
  visibleRegister = false,
  onNavigate = () => {},
}) => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    onNavigate();
    navigation.navigate('RegisterService', {
      eventId,
      genders,
      states,
      cities,
      priorities,
    });
  };

  return (
    <View style={[styles.toolbar, { backgroundColor: borderBottomColor }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackPage name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { color: titleColor }]}>
          {title}
        </Text>
      </View>
      {visibleRegister && (
        <TouchableOpacity
          style={styles.newParticipantButton}
          onPress={handleNavigate}
        >
          <UserAddLine />
          <Text style={styles.newParticipantButtonText}>Novo participante</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 50,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Regular',
    marginLeft: 10,
  },
  newParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A859',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    elevation: 2,
  },
  newParticipantButtonText: {
    color: 'white',
    fontFamily: 'Ubuntu-Medium',
    fontSize: 10,
    marginLeft: 6,
  },
  headerDate: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 12,
    color: '#303030ff',
  },
  toolbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 50,
  },
});

export default Toolbar;
