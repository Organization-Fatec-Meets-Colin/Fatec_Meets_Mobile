import { meetsApi } from '../libs/api';

// Listar todas as postagens
export const listPostagens = async () => {
    const response = await meetsApi.get('/api/postagens');
    return response.data;
};

// Buscar postagem por ID
export const getPostagemById = async (id) => {
    const response = await meetsApi.get(`/api/postagens/${id}`);
    return response.data;
};

// Criar nova postagem
export const createPostagem = async (postagem) => {
    const response = await meetsApi.post('/api/postagens', postagem);
    return response.data;
};

// Atualizar postagem existente
export const updatePostagem = async (id, postagem) => {
    const response = await meetsApi.put(`/api/postagens/${id}`, postagem);
    return response.data;
};

// Excluir postagem
export const deletePostagem = async (id) => {
    const response = await meetsApi.delete(`/api/postagens/${id}`);
    return response.data;
};
