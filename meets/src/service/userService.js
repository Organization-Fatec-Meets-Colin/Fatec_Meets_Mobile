import { meetsApi } from '../libs/api';

// Listar todos os usuários (com paginação opcional)
export const listUsers = async (params = {}) => {
    const { page = 0, size = 20, sortBy = 'id', paginado = false } = params;
    const response = await meetsApi.get('/api/usuarios', {
        params: { page, size, sortBy, paginado }
    });
    return response.data;
};

// Buscar usuário por ID
export const getUserById = async (id) => {
    const response = await meetsApi.get(`/api/usuarios/${id}`);
    return response.data;
};

// Criar novo usuário
export const createUser = async (usuario) => {
    const response = await meetsApi.post('/api/usuarios', usuario);
    return response.data;
};

// Atualizar usuário existente
export const updateUser = async (id, usuario) => {
    const response = await meetsApi.put(`/api/usuarios/${id}`, usuario);
    return response.data;
};

// Excluir usuário
export const deleteUser = async (id) => {
    const response = await meetsApi.delete(`/api/usuarios/${id}`);
    return response.data;
};

export const loginUser = async (email, senha) => {
    const response = await meetsApi.post('/users/login', { email, senha });
    return response.data;
};