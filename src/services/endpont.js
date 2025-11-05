import api from '../services/api';

export default {
  getEventsAtendeDate: async date => {
    const json = await api.get('/eventos-atende', {
      params: {
        started_at_between: date,
      },
    });
    return json?.data || [];
  },

  getMonthlyEventCounts: async year => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
      const json = await api.get('/eventos-atende', {
        params: {
          started_at_between: `${startDate},${endDate}`,
        },
      });

      let events = []; // Começa com um array vazio

      // 1. Verifica se 'json.data' existe E é um array (o cenário ideal)
      if (Array.isArray(json?.data)) {
        events = json.data;
      }
      // 2. Se 'json.data' não for um array, verifica se a *própria resposta* 'json' é um array
      else if (Array.isArray(json)) {
        console.warn("API '/eventos-atende' retornou um array na raiz.");
        events = json;
      }
      // 3. Se 'json.data' for um objeto (mas não um array), tenta converter seus valores
      else if (json?.data && typeof json.data === 'object') {
        console.warn(
          "API '/eventos-atende' retornou 'data' como um objeto, não um array.",
        );
        // Isso converte { "0": {...}, "1": {...} } em [ {...}, {...} ]
        events = Object.values(json.data);
      }
      // Se nenhuma das condições acima for atendida, 'events' continuará
      // sendo um array vazio [], e o código não vai quebrar.

      // 4. Inicializa o contador para todos os 12 meses
      const counts = {};
      for (let i = 0; i < 12; i++) {
        counts[i] = 0;
      }

      // 5. Processa os eventos (agora 'events' é garantido como um array)
      for (const event of events) {
        try {
          const eventDate = new Date(event.started_at);
          const monthIndex = eventDate.getMonth(); // 0 (Jan) a 11 (Dez)

          if (counts.hasOwnProperty(monthIndex)) {
            counts[monthIndex]++;
          }
        } catch (e) {
          console.error('Data do evento inválida:', event.started_at, e);
        }
      }

      return counts;
    } catch (error) {
      console.error('Erro fatal ao buscar contagem de eventos:', error);
      // Retorna um objeto de contagens vazio para não quebrar o app
      const emptyCounts = {};
      for (let i = 0; i < 12; i++) {
        emptyCounts[i] = 0;
      }
      return emptyCounts;
    }
  },
  getEventsAtendeStatus: async status => {
    const json = await api.get('/eventos-atende', {
      params: {
        status: status,
      },
    });
    return json?.data || [];
  },

  patchEventsServices: async (id, name = '', situation = []) => {
    const response = await api.patch(`/evento-atendimento/${id}`, {
      name: name,
      situation: situation,
    });
    return response?.data || [];
  },

  deleteEventsServices: async id => {
    const json = await api.delete(`/evento-atendimento/excluir/${id}`);
    return json?.data || [];
  },

  getCreateEvent: async id => {
    const json = await api.get(`/evento-atendimento/criar/${id}`);
    return json?.data || [];
  },

  getShowEvent: async id => {
    const json = await api.get(`/evento-atendimento/visualizar/${id}`);
    return json?.data || [];
  },

  getCities: async () => {
    const json = await api.get(`/cidades`);
    return json?.data || [];
  },

  getProfile: async () => {
    const json = await api.get(`/perfil-atendimento`);
    return json?.data || [];
  },

  getRecoverPassword: async cpf => {
    const json = await api.get('/evento-atendimento/recuperar-senha', {
      params: {
        cpf: cpf,
      },
    });
    return json?.data || [];
  },

  getVerifyToken: async (cpf, token) => {
    const json = await api.get('/evento-atendimento/validar-token', {
      params: {
        cpf: cpf,
        token: token,
      },
    });
    return json?.data || [];
  },

  getParticipantCpf: async (cpf, evento_id) => {
    const json = await api.get('/evento-atendimento/buscar-participante', {
      params: {
        cpf: cpf,
        evento_id: evento_id,
      },
    });
    return json?.data || [];
  },

  postUpdatePassword: async (password, confirm_password, id, token) => {
    const response = await api.post('/evento-atendimento/atualizar-senha', {
      password: password,
      confirm_password: confirm_password,
      id: id,
      token: token,
    });
    return response?.data || [];
  },

  searchPeopleByName: async name => {
    try {
      // 1. pega todos os eventos
      const base = await api.get('/eventos-atende');
      const events = Array.isArray(base.data) ? base.data : [];

      let results = [];

      // 2. busca participantes de cada evento
      for (const ev of events) {
        try {
          const fullEvent = await api.get(
            `/evento-atendimento/visualizar/${ev.id}`,
          );

          const participants = fullEvent?.data?.participants || [];

          // 3. filtragem
          participants.forEach(p => {
            if (
              p.name_participant?.toLowerCase().includes(name.toLowerCase())
            ) {
              results.push({
                ...p,
                event_id: ev.id,
                event_name: ev.name,
                city: ev.city,
                event_status: ev.status,
              });
            }
          });
        } catch (innerError) {
          console.log('Erro em evento', ev.id, innerError);
        }
      }

      return results;
    } catch (error) {
      console.log('Erro na busca global', error);
      return [];
    }
  },

  postEventParticipant: async (
    cpf,
    name_participant,
    gender_id,
    birth_date,
    state_id,
    city_id,
    email,
    cell_phone,
    allergy,
    medicine_use,
    medical_conditions,
    allergy_value,
    medicine_use_value,
    medical_conditions_value,
    evento_id,
    prioritie_id,
    services,
  ) => {
    const response = await api.post('/evento-atendimento/criar', {
      cpf: cpf,
      name_participant: name_participant,
      gender_id: gender_id,
      birth_date: birth_date,
      state_id: state_id,
      city_id: city_id,
      email: email,
      cell_phone: cell_phone,
      allergy: allergy,
      medicine_use: medicine_use,
      medical_conditions: medical_conditions,
      allergy_value: allergy_value,
      medicine_use_value: medicine_use_value,
      medical_conditions_value: medical_conditions_value,
      evento_id: evento_id,
      prioritie_id: prioritie_id,
      services: services,
    });
    return response?.data || [];
  },
  putEventPrioridade: async (evento_id, prioritie_id) => {
    const response = await api.put(
      `/atendimento/atualizar-prioridade/${evento_id}`,
      {
        prioritie_id: prioritie_id,
      },
    );
    return response?.data || [];
  },

  putEventParticipant: async (
    id,
    physical_people_id,
    allergy,
    medicine_use,
    medical_conditions,
    allergy_value,
    medicine_use_value,
    medical_conditions_value,
    description,
    intercurrence,
    specialist,
    action_service,
  ) => {
    const response = await api.put(`/evento-atendimento/atualizar/${id}`, {
      physical_people_id: physical_people_id,
      allergy: allergy,
      medicine_use: medicine_use,
      medical_conditions: medical_conditions,
      allergy_value: allergy_value,
      medicine_use_value: medicine_use_value,
      medical_conditions_value: medical_conditions_value,
      description: description,
      intercurrence: intercurrence,
      specialist: specialist,
      action_service: action_service,
    });
    return response?.data || [];
  },
};
