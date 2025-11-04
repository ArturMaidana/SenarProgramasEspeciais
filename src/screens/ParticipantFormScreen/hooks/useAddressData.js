import { useState, useEffect, useMemo } from 'react';
export default function useAddressData() {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    )
      .then(res => res.json())
      .then(setEstados);
  }, []);

  useEffect(() => {
    if (selectedEstado) {
      setLoadingCidades(true);
      setCidades([]);
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`,
      )
        .then(res => res.json())
        .then(data => {
          setCidades(data);
          setLoadingCidades(false);
        });
    } else {
      setCidades([]);
    }
  }, [selectedEstado]);

  return useMemo(
    () => ({
      estados,
      cidades,
      selectedEstado,
      setSelectedEstado,
      selectedCidade,
      setSelectedCidade,
      loadingCidades,
    }),
    [estados, cidades, selectedEstado, selectedCidade, loadingCidades],
  );
}
