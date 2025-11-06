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
      {/* O título "Dados do Participante" foi removido daqui,
          pois ele já está sendo exibido no header da tela (conforme ajuste anterior). */}

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
    paddingHorizontal: 20, // Padding lateral
    paddingTop: 10, // Padding no topo (logo abaixo do header)
    backgroundColor: '#FFFFFF', // Fundo branco
  },
  inputContainer: {
    marginBottom: 10, // Espaço entre os campos
    flex: 1, // Necessário para os campos em linha (Sexo/Data)
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666', // Cor cinza do protótipo
    marginBottom: 4,
    textTransform: 'uppercase', // CAIXA ALTA como no protótipo
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0', // Borda cinza clara
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    height: 52,
    backgroundColor: '#FFF', // Fundo branco
    color: '#333', // Cor do texto
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    flex: 1, // Divide o espaço
  },
  marginRight: {
    marginRight: 10, // Espaço entre os campos da linha
  },
});
export default CardParticipant;
