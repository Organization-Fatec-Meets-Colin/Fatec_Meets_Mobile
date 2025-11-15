import { useState, useEffect } from 'react';
import { listPostagens } from '../service/postagemService';

/**
 * Hook customizado para buscar posts com diferentes filtros
 * 
 * @param {Object} options - Opções de filtro
 * @param {number} options.usuarioId - ID do usuário para filtrar posts
 * @param {boolean} options.apenasEventos - Se true, retorna apenas posts com eventos
 * @param {boolean} options.autoLoad - Se true, carrega automaticamente ao montar
 * 
 * @returns {Object} { posts, loading, error, refresh }
 */
export const usePosts = ({ usuarioId = null, apenasEventos = false, autoLoad = true } = {}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Buscar todos os posts
            const data = await listPostagens();

            let filteredPosts = data;

            // Filtrar por usuário se especificado
            if (usuarioId) {
                filteredPosts = filteredPosts.filter(post => post.usuario?.id === usuarioId);
            }

            // Filtrar apenas eventos se especificado
            if (apenasEventos) {
                filteredPosts = filteredPosts.filter(post => post.evento != null);
            }

            // Ordenar por data de criação (mais recente primeiro)
            filteredPosts.sort((a, b) => {
                const dateA = new Date(a.dataCriacao);
                const dateB = new Date(b.dataCriacao);
                return dateB - dateA;
            });

            setPosts(filteredPosts);
        } catch (err) {
            console.error('Erro ao buscar posts:', err);
            setError(err.message || 'Erro ao buscar posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoLoad) {
            fetchPosts();
        }
    }, [usuarioId, apenasEventos, autoLoad]);

    return {
        posts,
        loading,
        error,
        refresh: fetchPosts
    };
};
