import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import SearchBarWithFilters from '../../components/SearchBarWithFilters';
import AttendanceCategoryCard from '../../components/AttendanceCategoryCard';
import { allCategories } from '../../utils/attendanceMocks';
import { BackPage, UserAddLine } from '../../components/Icons/Icons';
import { s, vs, ms } from 'react-native-size-matters';

export default function AtendimentoScreen({ navigation }) {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const handleClickBack = () => {
    navigation.goBack();
  };

  const handleClickNext = () => {
    navigation.navigate('NewFormulario');
  };

  const displayedData = useMemo(() => {
    let filteredData = allCategories;

    if (selectedStatuses.length > 0) {
      filteredData = allCategories
        .map(category => ({
          ...category,
          attendances: category.attendances.filter(item =>
            selectedStatuses.includes(item.status),
          ),
        }))
        .filter(category => category.attendances.length > 0);
    }

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      filteredData = filteredData
        .map(category => ({
          ...category,
          attendances: category.attendances.filter(
            item =>
              item.name.toLowerCase().includes(searchLower) ||
              item.cpf.includes(searchValue) ||
              item.contact.includes(searchValue),
          ),
        }))
        .filter(category => category.attendances.length > 0);
    }

    return filteredData;
  }, [selectedStatuses, searchValue]);

  const handleSearchChange = text => {
    setSearchValue(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={handleClickBack}>
          <BackPage style={styles.IconTop} />
          <Text style={styles.headerTitle}>Atendimento</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.headerCity}>Alta Boa Vista</Text>
          <Text style={styles.headerDate}>04/02/2025</Text>
          <TouchableOpacity
            style={styles.newParticipantButton}
            onPress={handleClickNext}
          >
            <UserAddLine />
            <Text style={styles.newParticipantButtonText}>
              Novo participante
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBarWithFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
        filterConfig={{
          modalTitle: 'Filtrar Atendimentos',
          statusSubtitle: 'Status do Atendimento',
          applyButtonText: 'Aplicar Filtros',
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {displayedData.length > 0 ? (
          displayedData.map(category => (
            <AttendanceCategoryCard
              key={category.categoryName}
              categoryName={category.categoryName}
              attendances={category.attendances}
            />
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              {searchValue || selectedStatuses.length > 0
                ? 'Nenhum resultado encontrado para sua busca'
                : 'Nenhum atendimento disponível'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingTop: ms(25),
    paddingHorizontal: ms(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: ms(10),
    paddingVertical: ms(10),
    marginBottom: ms(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: ms(16),
    fontFamily: 'Ubuntu-Regular',
    marginLeft: ms(10),
  },
  IconTop: {
    padding: ms(9),
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerCity: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(16),
  },
  headerDate: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(12),
    color: '#333',
  },
  newParticipantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A859',
    paddingVertical: ms(8),
    paddingHorizontal: ms(12),
    borderRadius: ms(8),
    marginTop: ms(8),
    elevation: 2,
  },
  newParticipantButtonText: {
    color: 'white',
    fontFamily: 'Ubuntu-Medium',
    fontSize: ms(10),
    marginLeft: ms(6),
  },
  noResults: {
    padding: ms(20),
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    color: '#666',
    textAlign: 'center',
  },
});
