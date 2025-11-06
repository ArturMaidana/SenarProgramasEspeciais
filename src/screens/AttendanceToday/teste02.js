import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import RunningCard from '../../components/RunningCard';

import { s, vs, ms } from 'react-native-size-matters';

export default function AttendanceToday({ navigation }) {
  const handleCardPress = id => {
    navigation.navigate('Mutirao');
  };
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
          <RunningCard
            tagText="Mutirão Rural"
            idText="Alta Boa Vista - 04/02/2025"
            location="Aviso aos cidadãos de Alta Boa Vista: Vai acontecer um mutirão em Secretaria de igualdade Racial do município das 9h às 17h. Aproveite a oportunidade para regularizar sua situação; Fique atento à data! "
            date="13:05"
            statusText="Em Execução"
            onPress={() => handleCardPress(1)}
          />
          <RunningCard
            tagText="Mutirão Rural"
            idText="Alta Boa Vista - 04/02/2025"
            location="Aviso aos cidadãos de Alta Boa Vista: Vai acontecer um mutirão em Secretaria de igualdade Racial do município das 9h às 17h. Aproveite a oportunidade para regularizar sua situação; Fique atento à data! "
            date="13:05"
            statusText="Em Execução"
            onPress={() => handleCardPress(2)}
          />
          <RunningCard
            tagText="Mutirão Rural"
            idText="Alta Boa Vista - 04/02/2025"
            location="Aviso aos cidadãos de Alta Boa Vista: Vai acontecer um mutirão em Secretaria de igualdade Racial do município das 9h às 17h. Aproveite a oportunidade para regularizar sua situação; Fique atento à data! "
            date="13:05"
            statusText="Em Execução"
            onPress={() => handleCardPress(3)}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  scrollContentContainer: {
    paddingHorizontal: s(15),
    paddingBottom: vs(120),
    paddingTop: vs(35),
  },
  title: {
    fontSize: ms(19),
    fontFamily: 'Ubuntu-Bold',
    color: '#333',
    marginBottom: vs(5),
  },
  scrollcontainer: {
    padding: ms(2),
    marginTop: vs(10),
  },
});

//SENAR MT Programas Especiais
