import { useState, useCallback, useMemo } from 'react'; // 1. Importe o useMemo
import { Alert, Keyboard } from 'react-native';
import { fetchCpfData } from '../../services/CpfService';

export default function usePersonalData() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loadingCpf, setLoadingCpf] = useState(false);

  const handleCpfConsult = useCallback(async () => {
    // ... sua lógica de consulta ...
  }, [cpf]);

  // 2. Envolva o objeto de retorno com useMemo
  return useMemo(
    () => ({
      cpf,
      setCpf,
      nome,
      setNome,
      sexo,
      setSexo,
      dataNascimento,
      setDataNascimento,
      email,
      setEmail,
      telefone,
      setTelefone,
      loadingCpf,
      setLoadingCpf,
      handleCpfConsult,
    }),
    [
      cpf,
      nome,
      sexo,
      dataNascimento,
      email,
      telefone,
      loadingCpf,
      handleCpfConsult,
    ],
  ); // 3. Adicione todas as variáveis retornadas como dependências
}
