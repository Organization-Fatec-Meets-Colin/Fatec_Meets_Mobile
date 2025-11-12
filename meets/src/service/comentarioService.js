import { meetsApi } from '../libs/api';

// Listar todos os comentários
export const listComentarios = async () => {
    const response = await meetsApi.get('/api/comentarios');
    return response.data;
};

// Buscar comentário por ID
export const getComentarioById = async (id) => {
    const response = await meetsApi.get(`/api/comentarios/${id}`);
    return response.data;
};

// Criar novo comentário
export const createComentario = async (comentario) => {
    const response = await meetsApi.post('/api/comentarios', comentario);
    return response.data;
};

// Excluir comentário
export const deleteComentario = async (id) => {
    const response = await meetsApi.delete(`/api/comentarios/${id}`);
    return response.data;
};
