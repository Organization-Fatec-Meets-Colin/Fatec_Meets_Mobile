import { meetsApi } from '../libs/api';

// Login de usuário
export const login = async (email, senha) => {
    const response = await meetsApi.post('/api/auth/login', {
        email,
        senha
    });
    return response.data;
};

// Função auxiliar para armazenar token
export const saveToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};

// Função auxiliar para obter token
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Função auxiliar para remover token (logout)
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
    }
};

// Verificar se está autenticado
export const isAuthenticated = () => {
    return getToken() !== null;
};
