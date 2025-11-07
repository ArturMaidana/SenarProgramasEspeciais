import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

import {
  ClosedBook,
  Portfolio,
  Heart,
  PlantFill,
} from '../../components/Icons/Icons';

const mutiraoTypes = [
  {
    key: 'rural',
    title: 'Programa Rural',
    subtitle: 'Solicite agendamentos...',
    Icon: PlantFill,
  },
  {
    key: 'saude',
    title: 'Programa Saúde',
    subtitle: 'Solicite agendamentos...',
    Icon: Heart,
  },
  {
    key: 'conhecimento',
    title: 'Programa Conhecimento',
    subtitle: 'Solicite agendamentos...',
    Icon: ClosedBook,
  },
  {
    key: 'cidadania',
    title: 'Programa Cidadania',
    subtitle: 'Solicite agendamentos...',
    Icon: Portfolio,
  },
];

export default function SelectMutiraoScreen({ navigation }) {
  const [selectedMutirao, setSelectedMutirao] = useState(null);

  const handleSelect = mutiraoKey => {
    setSelectedMutirao(mutiraoKey);
  };

  const handleStart = () => {
    if (selectedMutirao) {
      navigation.navigate('TabNavigator', { mutiraoType: selectedMutirao });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Cada mutirão é uma nova oportunidade de fazer a diferença.
          </Text>
          <Text style={styles.subtitle}>Por onde você quer começar hoje?</Text>
        </View>

        <View style={styles.gridContainer}>
          {mutiraoTypes.map(item => {
            const isSelected = selectedMutirao === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => handleSelect(item.key)}
              >
                <View style={styles.cardIconContainer}>
                  <item.Icon color={isSelected ? '#00A859' : '#333'} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedMutirao && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={!selectedMutirao}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(40),
    paddingBottom: vs(20),
  },
  headerContainer: {
    marginBottom: vs(30),
  },
  title: {
    fontSize: ms(23),
    color: '#212121',
    textAlign: 'Justify',
    marginBottom: vs(10),
    fontWeight: 'normal',
  },
  subtitle: {
    fontWeight: 'normal',
    fontSize: ms(16),
    color: '#000000ff',
    textAlign: 'Justify',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(8),
    padding: s(15),
    marginBottom: vs(15),
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    borderColor: '#00A859',
  },
  cardIconContainer: {
    marginBottom: vs(15),
    height: s(45),
  },
  cardTitle: {
    fontWeight: 'normal',
    fontSize: ms(15),
    color: '#333',
    marginBottom: vs(4),
  },
  cardSubtitle: {
    fontWeight: 'normal',
    fontSize: ms(13),
    color: '#000000ff',
  },
  footerContainer: {
    paddingHorizontal: s(20),
    paddingBottom: vs(30),
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00A859',
    borderRadius: ms(10),
    paddingVertical: vs(14),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(20),
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontWeight: 'normal',
    color: '#FFFFFF',
    fontSize: ms(15),
  },
});
