import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';

import FormHeader from '../../components/FormHeader';
import Step1PersonalData from '../../components/participantForm/Step1PersonalData';
import Step2MedicalHistory from '../../components/participantForm/Step2MedicalHistory';
import Step3Confirmation from '../../components/participantForm/Step3Confirmation';

import usePersonalData from './hooks/usePersonalData';
import useAddressData from './hooks/useAddressData';
import useMedicalHistory from './hooks/useMedicalHistory';

export default function ParticipantFormScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const personal = usePersonalData();
  const address = useAddressData();
  const medical = useMedicalHistory();

  const [responsavel] = useState('LUIS FELIPE AMORIM');
  const [observacoes, setObservacoes] = useState('');
  const [intercorrencia, setIntercorrencia] = useState('');
  const [necessitaEspecialista, setNecessitaEspecialista] = useState(false);

  const handleMockCpfConsult = async () => {
    /* ... */
  };

  const handleFinalize = () => {
    /* ... */
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <FormHeader step={step} setStep={setStep} navigation={navigation} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {step === 1 && (
          <Step1PersonalData
            cpf={personal.cpf}
            setCpf={personal.setCpf}
            nome={personal.nome}
            setNome={personal.setNome}
            sexo={personal.sexo}
            setSexo={personal.setSexo}
            dataNascimento={personal.dataNascimento}
            setDataNascimento={personal.setDataNascimento}
            email={personal.email}
            setEmail={personal.setEmail}
            telefone={personal.telefone}
            setTelefone={personal.setTelefone}
            loadingCpf={personal.loadingCpf}
            estados={address.estados}
            cidades={address.cidades}
            selectedEstado={address.selectedEstado}
            setSelectedEstado={address.setSelectedEstado}
            selectedCidade={address.selectedCidade}
            setSelectedCidade={address.setSelectedCidade}
            loadingCidades={address.loadingCidades}
            onCpfConsult={handleMockCpfConsult}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2MedicalHistory
            nome={personal.nome}
            prioridade={medical.prioridade}
            setPrioridade={medical.setPrioridade}
            atendimentos={medical.atendimentos}
            setAtendimentos={medical.setAtendimentos}
            possuiAlergias={medical.possuiAlergias}
            setPossuiAlergias={medical.setPossuiAlergias}
            descAlergias={medical.descAlergias}
            setDescAlergias={medical.setDescAlergias}
            usaMedicamentos={medical.usaMedicamentos}
            setUsaMedicamentos={medical.setUsaMedicamentos}
            descMedicamentos={medical.descMedicamentos}
            setDescMedicamentos={medical.setDescMedicamentos}
            temCondicoes={medical.temCondicoes}
            setTemCondicoes={medical.setTemCondicoes}
            descCondicoes={medical.descCondicoes}
            setDescCondicoes={medical.setDescCondicoes}
            onNext={() => setStep(3)}
            onPrevious={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Confirmation
            responsavel={responsavel}
            nome={personal.nome}
            cpf={personal.cpf}
            sexo={personal.sexo}
            dataNascimento={personal.dataNascimento}
            observacoes={observacoes}
            setObservacoes={setObservacoes}
            intercorrencia={intercorrencia}
            setIntercorrencia={setIntercorrencia}
            necessitaEspecialista={necessitaEspecialista}
            setNecessitaEspecialista={setNecessitaEspecialista}
            onFinalize={handleFinalize}
            onPrevious={() => setStep(2)}
          />
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 15,
  },
});
