import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 10,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007C6F',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 48,
  },
  inputArea: {
    borderWidth: 1,
    borderColor: '#007C6F',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#454652',
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
  titleName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#007C6F',
    marginBottom: 5,
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    borderColor: '#00A878',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 0,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 2,
    color: '#007C6F',
  },
  button: {
    backgroundColor: '#37C064',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonBack: {
    backgroundColor: '#007C6F',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  specialistOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  specialistTextContainer: {
    flex: 1, // Faz o texto ocupar o espaço restante
    marginLeft: 5, // Espaço entre o switch e o texto
  },
  specialistText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialistDescription: {
    fontSize: 12,
    color: '#777',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRodape: {
    backgroundColor: '#37C064',
    padding: 10,
    borderRadius: 4,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#007C6F',
    marginBottom: 5,
  },
});
export default styles;
