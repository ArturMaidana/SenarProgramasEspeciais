import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// Adicionei a importação das funções de escala para responsividade
import { s, vs, ms } from 'react-native-size-matters';

import SearchBarWithFilters from '../../components/SearchBarWithFilters';
import AttendanceCategoryCard from '../../components/AttendanceCategoryCard';
import { BackPage, ShareSocial } from '../../components/Icons/Icons';
import { allCategories } from '../../utils/attendanceMocks';

export default function AttendanceScreen({ navigation }) {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const handleClickBack = () => {
    navigation.goBack();
  };

  const handleCardPress = id => navigation.navigate('Relatorio', { id });

  const displayedData = useMemo(() => {
    // ... sua lógica de filtro continua a mesma
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

      {/* ETAPA 1: Envolver o ScrollView em uma View flexível */}
      <View style={styles.contentArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: vs(20) }} // Adiciona espaço no final da lista
        >
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

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate('Relatorio')}
      >
        <ShareSocial />
        <Text style={styles.reportButtonText}>Relatório de atendimentos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingTop: vs(35),
    paddingHorizontal: ms(10), // Ajuste para consistência
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: vs(10),
    marginBottom: vs(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: ms(18),
    fontFamily: 'Ubuntu-Regular',
    marginLeft: s(10),
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerCity: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(18),
  },
  headerDate: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(12),
    color: '#303030ff',
  },
  contentArea: {
    flex: 1,
  },
  noResults: {
    padding: ms(20),
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(16),
    color: '#666',
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: '#00A859',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: vs(15),
    marginBottom: vs(50),
    paddingVertical: vs(12),
    borderRadius: ms(10),
    elevation: 4,
    width: '70%',
    height: vs(40),
  },
  reportButtonText: {
    fontFamily: 'Ubuntu-Regular',
    color: '#FFF',
    fontSize: ms(14),
    marginLeft: s(15),
  },
});
