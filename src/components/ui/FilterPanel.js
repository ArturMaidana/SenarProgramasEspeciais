// components/FilterPanel.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox, Button, TextInput } from 'react-native-paper';

export default function FilterPanel({
  searchName,
  setSearchName,
  selectedSituations,
  setSelectedSituations,
  situationsMaps = {},
  onApply,
  onClear,
}) {
  const handleCheckboxChange = id => {
    setSelectedSituations(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      {/* Campo de busca */}
      <TextInput
        label="Buscar por nome ou CPF"
        value={searchName}
        onChangeText={text => setSearchName(text)}
        mode="outlined"
        style={styles.input}
        theme={{
          colors: {
            primary: '#007C6F',
            placeholder: '#007C6F',
          },
        }}
      />

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        {Object.keys(situationsMaps).map(id => (
          <View key={id} style={styles.checkboxWrapper}>
            <Checkbox
              status={
                selectedSituations.includes(Number(id))
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => handleCheckboxChange(Number(id))}
              color="#007C6F"
            />
            <Text style={styles.checkboxLabel}>{situationsMaps[id]}</Text>
          </View>
        ))}
      </View>

      {/* Botões */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={onApply}
          style={[styles.button, { marginRight: 6 }]}
        >
          Aplicar Filtros
        </Button>

        <Button mode="contained" onPress={onClear} style={styles.button}>
          Limpar
        </Button>
      </View>
    </View>
  );
}

/* ******************************
 * ESTILOS
 ******************************** */
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },

  input: {
    backgroundColor: '#fafafa',
    marginBottom: 12,
    borderRadius: 4,
  },

  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },

  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },

  button: {
    flex: 1,
    backgroundColor: '#37C064',
    borderRadius: 4,
  },
});
