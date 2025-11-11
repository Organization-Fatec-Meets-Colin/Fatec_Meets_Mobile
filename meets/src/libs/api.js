import axios from 'axios';

class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AppError';
    }
}

// Base URL da API - ajuste conforme necessário
const API_BASE_URL = 'https://9xpzx34n-8080.brs.devtunnels.ms/';
// const API_BASE_URL = 'https://9xpzx34n-8080.brs.devtunnels.ms/'; // DevTunnel
// Para produção: 'https://api.fatecmeets.com.br'

export const meetsApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

meetsApi.registerInterceptTokenManager = (signOut, getToken) => {
    meetsApi.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    meetsApi.interceptors.response.use(
        (response) => response,
        async (requestError) => {
            if (
                requestError.response?.status === 403 ||
                requestError.response?.data?.message === 'Usuario não encontrado no sistema'
            ) {
                signOut();
                return Promise.reject(requestError);
            }

            if (requestError.response && requestError.response.data) {
                return Promise.reject(new AppError(requestError.response.data.message));
            } else {
                return Promise.reject(requestError);
            }
        }
    );
};