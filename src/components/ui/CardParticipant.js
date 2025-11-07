import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CardParticipant = ({
  nameInstrutor,
  namePartipant,
  cpf,
  sexo,
  dateNascimento,
}) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Responsável pelo atendimento</Text>
        <TextInput
          style={styles.input}
          value={nameInstrutor}
          editable={false}
          placeholder="Responsável"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Participante</Text>
        <TextInput
          style={styles.input}
          value={namePartipant}
          editable={false}
          placeholder="Participante"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          editable={false}
          placeholder="000.000.000-00"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.row}>
        <View
          style={[
            styles.inputContainer,
            styles.halfInputContainer,
            styles.marginRight,
          ]}
        >
          <Text style={styles.label}>Sexo</Text>
          <TextInput
            style={styles.input}
            value={sexo}
            editable={false}
            placeholder="Masculino"
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputContainer, styles.halfInputContainer]}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={dateNascimento}
            editable={false}
            placeholder="01/01/1900"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 10,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    height: 52,
    backgroundColor: '#FFF',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    flex: 1,
  },
  marginRight: {
    marginRight: 10,
  },
});
export default CardParticipant;
