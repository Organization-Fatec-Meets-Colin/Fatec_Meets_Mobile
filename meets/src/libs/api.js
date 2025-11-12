import axios from 'axios';

class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AppError';
    }
}

// Base URL da API - ajuste conforme necessário
// IMPORTANTE: NÃO colocar barra (/) no final da URL para evitar erro 404

// CONFIGURAÇÃO ATUAL: 
// Descomente a linha apropriada para seu ambiente de desenvolvimento:

// const API_BASE_URL = 'http://10.0.2.2:8080'; // 📱 Android Emulator (RECOMENDADO)
// const API_BASE_URL = 'http://26.55.111.140:8080'; // 📱 Dispositivo Físico (IP da rede local)
// const API_BASE_URL = 'http://localhost:8080'; // 🍎 iOS Simulator / Expo Go
const API_BASE_URL = 'https://9xpzx34n-8080.brs.devtunnels.ms'; // ❌ DevTunnel (NÃO funciona com POST)
// const API_BASE_URL = 'https://api.fatecmeets.com.br'; // 🌐 Produção

export const meetsApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Helper para construir URLs completas de imagens
 * @param {string} imagePath - Caminho relativo da imagem (ex: "/uploads/postagens/image.jpg")
 * @returns {string} URL completa da imagem
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Se já é uma URL completa (http/https), retorna como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Monta URL completa com a base URL
    return `${API_BASE_URL}${imagePath}`;
};

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