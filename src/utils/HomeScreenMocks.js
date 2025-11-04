// src/utils/HomeScreenMocks.js

// 4. DADOS DE EVENTOS PARA A HOME SCREEN
export const mockEventsData = [
  {
    id: 101,
    tagText: 'Mutirão Rural',
    idText: 'Nº - 2025M09A - Sapezal',
    location: 'Sapezal',
    date: '2025-09-15',
    statusText: 'Realizado',
  },
  {
    id: 102,
    tagText: 'Mutirão Rural',
    idText: 'Nº - 2025M10A - Alta Floresta',
    location: 'Alta Floresta',
    date: '2025-10-12',
    statusText: 'Fechamento',
  },
  {
    id: 103,
    tagText: 'Mutirão Urbano',
    idText: 'Nº - 2025M10B - Cuiabá',
    location: 'Cuiabá',
    date: '2025-10-25',
    statusText: 'Aberto',
  },
  {
    id: 104,
    tagText: 'Mutirão Rural',
    idText: 'Nº - 2025M11A - Comodoro',
    location: 'Comodoro',
    date: '2025-11-10',
    statusText: 'Aberto',
  },
  {
    id: 105,
    tagText: 'Mutirão Rural',
    idText: 'Nº - 2025M11B - Vila Rica',
    location: 'Vila Rica',
    date: '2025-11-22',
    statusText: 'Aberto',
  },
  {
    id: 106,
    tagText: 'Mutirão Rural',
    idText: 'Nº - 2025M08A - Cáceres',
    location: 'Cáceres',
    date: '2025-08-20',
    statusText: 'Realizado',
  },
];

export const mockApiData = [
  {
    id: 1,
    type: 'Eventos',
    title: 'Mutirão Rural - Comodoro',
    subtitle: 'Nº - 2025M1620091219T',
    tags: ['mutirão', 'rural', 'comodoro'],
    icon: '📅',
    navigation: 'EventDetail',
  },
  {
    id: 2,
    type: 'Eventos',
    title: 'Mutirão Urbano - Alta Floresta',
    subtitle: 'Nº - 2025M1620091220T',
    tags: ['mutirão', 'urbano', 'alta floresta'],
    icon: '📅',
    navigation: 'EventDetail',
  },
  {
    id: 3,
    type: 'Eventos',
    title: 'Mutirão Urbano - Vila Rica',
    subtitle: 'Nº - 2025M1620091220T',
    tags: ['mutirão', 'urbano', 'vila rica'],
    icon: '📅',
    navigation: 'EventDetail',
  },
  {
    id: 4,
    type: 'Atendimentos',
    title: 'Artur Guilherme dos Santos Maidana',
    subtitle: 'Oftalmologia - Realizada',
    tags: ['oftalmologia', 'realizada'],
    icon: '👥',
    navigation: 'Atendimento',
  },
  {
    id: 5,
    type: 'Atendimentos',
    title: 'Amauri Constantine Duarte',
    subtitle: 'Oftalmologia - Realizada',
    tags: ['oftalmologia', 'realizada'],
    icon: '👥',
    navigation: 'Atendimento',
  },
  {
    id: 6,
    type: 'Atendimentos',
    title: 'Rafael Edigio Souza Martins',
    subtitle: 'Oftalmologia - Realizada',
    tags: ['oftalmologia', 'realizada'],
    icon: '👥',
    navigation: 'Atendimento',
  },
  {
    id: 7,
    type: 'Atendimentos',
    title: 'Felipe Douglas',
    subtitle: 'Odontologia - Aguardando',
    tags: ['odontologia', 'aguardando'],
    icon: '👥',
    navigation: 'Atendimento',
  },
  {
    id: 8,
    type: 'Serviços',
    title: 'Oftalmologia',
    subtitle: 'Consultas e exames oftalmológicos',
    tags: ['consulta', 'exame', 'visão'],
    icon: '🔧',
    navigation: 'Services',
  },
  {
    id: 9,
    type: 'Serviços',
    title: 'Enfermagem',
    subtitle: 'Tratamentos dentários',
    tags: ['dente', 'consulta', 'tratamento'],
    icon: '🔧',
    navigation: 'Services',
  },
  {
    id: 10,
    type: 'Serviços',
    title: 'Barbearia',
    subtitle: 'Tratamentos dentários',
    tags: ['dente', 'consulta', 'tratamento'],
    icon: '🔧',
    navigation: 'Services',
  },
  {
    id: 11,
    type: 'Serviços',
    title: 'Confecção Óculos',
    subtitle: 'Tratamentos dentários',
    tags: ['dente', 'consulta', 'tratamento'],
    icon: '🔧',
    navigation: 'Services',
  },
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Novo Mutirão Adicionado',
    description:
      'Mutirão Rural em Alta Floresta foi adicionado e está aguardando abertura.',
    time: '2 horas atrás',
    read: false,
  },
  {
    id: 2,
    title: 'Atualização de Status',
    description:
      'O status do Mutirão em Comodoro foi alterado para "Fechamento".',
    time: 'Ontem',
    read: false,
  },
  {
    id: 3,
    title: 'Evento Concluído',
    description:
      'O Mutirão Rural em Cáceres foi marcado como "Realizado" com sucesso.',
    time: '3 dias atrás',
    read: true,
  },
  {
    id: 4,
    title: 'Lembrete',
    description:
      'Não se esqueça de submeter os relatórios do evento de Sapezal.',
    time: '1 semana atrás',
    read: true,
  },
  {
    id: 5,
    title: 'Lembrete',
    description:
      'Não se esqueça de submeter os relatórios do evento de Sapezal.',
    time: '1 semana atrás',
    read: true,
  },
];

export const fetchApiData = async query => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!query) return [];
  const queryLower = query.toLowerCase();
  return mockApiData.filter(
    item =>
      item.title.toLowerCase().includes(queryLower) ||
      item.subtitle.toLowerCase().includes(queryLower) ||
      (item.tags &&
        item.tags.some(tag => tag.toLowerCase().includes(queryLower))),
  );
};

export const fetchUserData = async () => {
  return {
    name: 'Administrador',
    avatarUrl: 'https://i.pravatar.cc/444',
  };
};

export const getCurrentLocation = async () => {
  return {
    city: 'Cuiabá',
    state: 'Mato Grosso',
  };
};
