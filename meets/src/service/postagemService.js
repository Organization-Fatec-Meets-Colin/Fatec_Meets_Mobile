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
export const createPostagem = async (postagem, hasImages = false) => {
    const config = hasImages ? {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    } : {};
    
    const response = await meetsApi.post('/api/postagens', postagem, config);
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

// Adicionar like em uma postagem
export const addLike = async (postagemId, usuarioId) => {
    const response = await meetsApi.post(`/api/postagens/${postagemId}/like`, null, {
        params: { usuarioId }
    });
    return response.data;
};

// Remover like de uma postagem
export const removeLike = async (postagemId, usuarioId) => {
    const response = await meetsApi.delete(`/api/postagens/${postagemId}/like`, {
        params: { usuarioId }
    });
    return response.data;
};
