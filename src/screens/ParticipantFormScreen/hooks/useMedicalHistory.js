import { useState, useMemo } from 'react'; // 1. Importe o useMemo

export default function useMedicalHistory() {
  const [prioridade, setPrioridade] = useState('Normal');
  const [atendimentos, setAtendimentos] = useState({});
  const [possuiAlergias, setPossuiAlergias] = useState(false);
  const [descAlergias, setDescAlergias] = useState('');
  const [usaMedicamentos, setUsaMedicamentos] = useState(false);
  const [descMedicamentos, setDescMedicamentos] = useState('');
  const [temCondicoes, setTemCondicoes] = useState(false);
  const [descCondicoes, setDescCondicoes] = useState('');

  return useMemo(
    () => ({
      prioridade,
      setPrioridade,
      atendimentos,
      setAtendimentos,
      possuiAlergias,
      setPossuiAlergias,
      descAlergias,
      setDescAlergias,
      usaMedicamentos,
      setUsaMedicamentos,
      descMedicamentos,
      setDescMedicamentos,
      temCondicoes,
      setTemCondicoes,
      descCondicoes,
      setDescCondicoes,
    }),
    [
      prioridade,
      atendimentos,
      possuiAlergias,
      descAlergias,
      usaMedicamentos,
      descMedicamentos,
      temCondicoes,
      descCondicoes,
    ],
  );
}
