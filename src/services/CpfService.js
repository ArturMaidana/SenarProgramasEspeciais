const handleCpfConsult = async () => {
  try {
    Keyboard.dismiss();

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (!cpfLimpo || cpfLimpo.length !== 11) {
      Alert.alert('Erro', 'Por favor, informe um CPF válido.');
      return;
    }

    setLoadingCpf(true);

    const userData = {
      success: true,
      nome: 'Maria da Silva',
      sexo: 'Feminino',
      nascimento: '12/08/1995',
      message: null,
    };

    console.log('🧩 Dados mockados:', userData);

    if (userData?.success) {
      setNome(userData.nome || '');
      setSexo(userData.sexo || '');
      setDataNascimento(userData.nascimento || '');

      if (userData.nascimento) {
        const partes = userData.nascimento.split('/');
        if (partes.length === 3) {
          const ano = parseInt(partes[2], 10);
          if (!isNaN(ano)) {
            const age = new Date().getFullYear() - ano;
            setIdade(`${age} Anos`);
          }
        }
      } else {
        setIdade('');
      }
    } else {
      Alert.alert(
        'Erro ao consultar CPF',
        userData?.message || 'Dados não encontrados.',
      );
    }
  } catch (error) {
    console.error('❌ Erro inesperado (mock):', error);
    Alert.alert('Erro inesperado', 'Não foi possível simular o CPF.');
  } finally {
    setLoadingCpf(false);
  }
};
