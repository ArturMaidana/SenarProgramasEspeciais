// components/GlobalSearchBar.jsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import { SearchIcon } from '../../components/Icons/Icons';

export default function GlobalSearchBar({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchableItems = [
    { title: 'Mutirões', screen: 'Mutirao' },
    { title: 'Meus Atendimentos', screen: 'Atendimentos' },
    { title: 'Relatórios', screen: 'Relatorio' },
    { title: 'Perfil', screen: 'Profile' }, // coloque o nome da sua tela de perfil
    { title: 'Serviços', screen: 'ServiceDetails' },
    { title: 'Novo Atendimento', screen: 'NewFormulario' },
    { title: 'Home', screen: 'MainTabs' },
  ];

  const handleSearch = text => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const filtered = searchableItems.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase()),
    );

    setResults(filtered);
  };

  const handleSelect = item => {
    setQuery('');
    setResults([]);

    navigation.navigate(item.screen);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <SearchIcon width={18} height={18} />
        <TextInput
          style={styles.input}
          placeholder="Buscar em todo o sistema..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.resultText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#333',
  },
  resultsContainer: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    maxHeight: 200,
    overflow: 'hidden',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 14,
  },
});
