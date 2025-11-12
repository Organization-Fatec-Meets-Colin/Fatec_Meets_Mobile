import { meetsApi } from '../libs/api';

// Listar todas as instituições
export const listInstituicoes = async () => {
    const response = await meetsApi.get('/api/instituicoes');
    return response.data;
};

// Buscar instituição por ID
export const getInstituicaoById = async (id) => {
    const response = await meetsApi.get(`/api/instituicoes/${id}`);
    return response.data;
};

// Criar nova instituição
export const createInstituicao = async (instituicao) => {
    const response = await meetsApi.post('/api/instituicoes', instituicao);
    return response.data;
};

// Atualizar instituição existente
export const updateInstituicao = async (id, instituicao) => {
    const response = await meetsApi.put(`/api/instituicoes/${id}`, instituicao);
    return response.data;
};

// Excluir instituição
export const deleteInstituicao = async (id) => {
    const response = await meetsApi.delete(`/api/instituicoes/${id}`);
    return response.data;
};
