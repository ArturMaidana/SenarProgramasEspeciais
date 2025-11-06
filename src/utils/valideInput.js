import { isValidEmail } from './formatInput';

export const validarCampos = (
  cpf,
  nome,
  genderId,
  stateId,
  cityId,
  email,
  celular,
  prioritieId,
) => {
  if (email.trim() != '' && !isValidEmail(email)) {
    return 'E-mail inválido: ' + email;
  }
  if (!genderId) {
    return 'Informe o sexo!';
  }
  if (!stateId) {
    return 'Informe o Estado!';
  }
  if (!cityId) {
    return 'Informe o cidade!';
  }
  if (!prioritieId) {
    return 'Informe tipo de prioridade!';
  }
  if (nome == '') {
    return 'Informe o nome do participante!';
  }
  if (cpf == '') {
    return 'Informe o "CPF" do participante!';
  }
  const doc = ('' + cpf).replace(/\D/g, '');
  if (doc.length < 11) {
    return 'Informe um "CPF" válido!' + doc.length;
  }
  const cleaned = ('' + celular).replace(/\D/g, '');
  if (cleaned.length < 10) {
    return 'Informe um numero de telefone válido!';
  }
  return '';
};

export const validarHistorico = (
  alergiasChecked,
  alergiasText,
  medicamentosChecked,
  medicamentosText,
  condicoesChecked,
  condicoesText,
) => {
  if (alergiasChecked && alergiasText === '') {
    return 'Informe qual a sua alergia!';
  }

  return '';
};
