import { meetsApi } from '../libs/api';

// Listar todas as denúncias
export const listDenuncias = async () => {
    const response = await meetsApi.get('/api/denuncias');
    return response.data;
};

// Buscar denúncia por ID
export const getDenunciaById = async (id) => {
    const response = await meetsApi.get(`/api/denuncias/${id}`);
    return response.data;
};

// Criar nova denúncia
export const createDenuncia = async (denuncia) => {
    const response = await meetsApi.post('/api/denuncias', denuncia);
    return response.data;
};

// Excluir denúncia
export const deleteDenuncia = async (id) => {
    const response = await meetsApi.delete(`/api/denuncias/${id}`);
    return response.data;
};
