import { meetsApi } from '../libs/api';

// Listar todos os eventos
export const listEventos = async () => {
    const response = await meetsApi.get('/api/eventos');
    return response.data;
};

// Buscar evento por ID
export const getEventoById = async (id) => {
    const response = await meetsApi.get(`/api/eventos/${id}`);
    return response.data;
};

// Criar novo evento
export const createEvento = async (evento) => {
    const response = await meetsApi.post('/api/eventos', evento);
    return response.data;
};

// Atualizar evento existente
export const updateEvento = async (id, evento) => {
    const response = await meetsApi.put(`/api/eventos/${id}`, evento);
    return response.data;
};

// Excluir evento
export const deleteEvento = async (id) => {
    const response = await meetsApi.delete(`/api/eventos/${id}`);
    return response.data;
};
