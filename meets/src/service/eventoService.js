import { meetsApi } from '../libs/api';

// ========== CRUD de Eventos ==========

/**
 * Lista todos os eventos disponíveis
 * @returns {Promise<Array>} Lista de eventos
 */
export const listEventos = async () => {
    const response = await meetsApi.get('/api/eventos');
    return response.data;
};

/**
 * Busca um evento específico por ID
 * @param {number} id - ID do evento
 * @returns {Promise<Object>} Dados do evento com detalhes completos
 */
export const getEventoById = async (id) => {
    const response = await meetsApi.get(`/api/eventos/${id}`);
    return response.data;
};

/**
 * Cria um novo evento
 * @param {Object} evento - Dados do evento
 * @returns {Promise<Object>} Evento criado
 */
export const createEvento = async (evento) => {
    const response = await meetsApi.post('/api/eventos', evento);
    return response.data;
};

/**
 * Atualiza um evento existente
 * @param {number} id - ID do evento
 * @param {Object} evento - Novos dados do evento
 * @returns {Promise<Object>} Evento atualizado
 */
export const updateEvento = async (id, evento) => {
    const response = await meetsApi.put(`/api/eventos/${id}`, evento);
    return response.data;
};

/**
 * Exclui um evento
 * @param {number} id - ID do evento
 * @returns {Promise<void>}
 */
export const deleteEvento = async (id) => {
    const response = await meetsApi.delete(`/api/eventos/${id}`);
    return response.data;
};

// ========== Participação em Eventos ==========

/**
 * Confirma participação do usuário no evento
 * @param {number} eventoId - ID do evento
 * @param {number} usuarioId - ID do usuário
 * @returns {Promise<Object>} Evento atualizado com lista de participantes
 */
export const participarEvento = async (eventoId, usuarioId) => {
    const response = await meetsApi.post(`/api/eventos/${eventoId}/participar`, null, {
        params: { usuarioId }
    });
    return response.data;
};

/**
 * Cancela participação do usuário no evento
 * @param {number} eventoId - ID do evento
 * @param {number} usuarioId - ID do usuário
 * @returns {Promise<Object>} Evento atualizado com lista de participantes
 */
export const cancelarParticipacao = async (eventoId, usuarioId) => {
    const response = await meetsApi.delete(`/api/eventos/${eventoId}/participar`, {
        params: { usuarioId }
    });
    return response.data;
};

// ========== Utilitários de Evento ==========

/**
 * Verifica se o usuário está participando do evento
 * @param {Object} evento - Objeto do evento com lista de participantes
 * @param {number} usuarioId - ID do usuário
 * @returns {boolean} True se o usuário está participando
 */
export const isParticipante = (evento, usuarioId) => {
    if (!evento || !evento.participantes || !Array.isArray(evento.participantes)) {
        return false;
    }
    return evento.participantes.some(participante => participante.id === usuarioId);
};

/**
 * Retorna o total de participantes do evento
 * @param {Object} evento - Objeto do evento
 * @returns {number} Número de participantes
 */
export const getTotalParticipantes = (evento) => {
    if (!evento || !evento.participantes || !Array.isArray(evento.participantes)) {
        return 0;
    }
    return evento.participantes.length;
};

/**
 * Verifica se o evento está lotado
 * @param {Object} evento - Objeto do evento
 * @returns {boolean} True se o evento está lotado
 */
export const isEventoLotado = (evento) => {
    if (!evento || !evento.capacidadeMaxima) {
        return false; // Sem limite de capacidade
    }
    const total = getTotalParticipantes(evento);
    return total >= evento.capacidadeMaxima;
};

/**
 * Retorna o número de vagas disponíveis
 * @param {Object} evento - Objeto do evento
 * @returns {number|null} Número de vagas ou null se ilimitado
 */
export const getVagasDisponiveis = (evento) => {
    if (!evento || !evento.capacidadeMaxima) {
        return null; // Sem limite de vagas
    }
    const total = getTotalParticipantes(evento);
    return Math.max(0, evento.capacidadeMaxima - total);
};

/**
 * Formata a data do evento no formato brasileiro
 * @param {string} dataEvento - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
export const formatarDataEvento = (dataEvento) => {
    if (!dataEvento) return '';
    const [ano, mes, dia] = dataEvento.split('-');
    return `${dia}/${mes}/${ano}`;
};

/**
 * Formata o horário do evento
 * @param {string} horarioInicio - Horário de início (HH:mm:ss)
 * @param {string} horarioFim - Horário de fim (HH:mm:ss)
 * @returns {string} Horário formatado (HH:mm - HH:mm)
 */
export const formatarHorarioEvento = (horarioInicio, horarioFim) => {
    if (!horarioInicio) return '';
    
    const formatarHora = (horario) => {
        if (!horario) return '';
        const [hora, minuto] = horario.split(':');
        return `${hora}:${minuto}`;
    };
    
    const inicio = formatarHora(horarioInicio);
    const fim = horarioFim ? ` - ${formatarHora(horarioFim)}` : '';
    
    return `${inicio}${fim}`;
};

/**
 * Verifica se o evento já aconteceu
 * @param {string} dataEvento - Data no formato ISO (YYYY-MM-DD)
 * @param {string} horarioFim - Horário de fim (HH:mm:ss)
 * @returns {boolean} True se o evento já passou
 */
export const isEventoPassado = (dataEvento, horarioFim) => {
    if (!dataEvento) return false;
    
    const agora = new Date();
    const [ano, mes, dia] = dataEvento.split('-');
    
    let dataEventoObj = new Date(ano, mes - 1, dia);
    
    if (horarioFim) {
        const [hora, minuto] = horarioFim.split(':');
        dataEventoObj.setHours(parseInt(hora), parseInt(minuto));
    } else {
        dataEventoObj.setHours(23, 59, 59); // Final do dia
    }
    
    return agora > dataEventoObj;
};
