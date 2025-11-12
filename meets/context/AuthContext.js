import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meetsApi } from '../src/libs/api.js';
import { login as loginService } from '../src/service/authService.js';
import { createUser, getUserById } from '../src/service/userService.js';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [authIsLoading, setAuthIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function retrieveToken() {
            setAuthIsLoading(true);
            try {
                const storedToken = await AsyncStorage.getItem('meets-token');
                const storedUser = await AsyncStorage.getItem('meets-user');

                if (storedToken && storedUser) {
                    const userData = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(userData);
                    meetsApi.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
                    
                    console.log('🔄 Usuário recuperado do AsyncStorage (dados não sensíveis):', {
                        id: userData.id,
                        nome: userData.nome,
                        email: userData.email,
                        bio: userData.bio || null,
                        fotoPerfil: userData.fotoPerfil || null,
                        postagens: userData.postagens?.length || 0,
                        // Mostra todos os outros campos exceto senha
                        ...Object.keys(userData)
                            .filter(key => !['senha', 'password', 'id', 'nome', 'email', 'bio', 'fotoPerfil', 'postagens'].includes(key.toLowerCase()))
                            .reduce((obj, key) => {
                                obj[key] = userData[key];
                                return obj;
                            }, {})
                    });
                }
            } catch (error) {
                console.error('Erro ao recuperar token:', error);
            } finally {
                setAuthIsLoading(false);
            }
        }
        retrieveToken();
    }, []);

    async function login(email, senha) {
        setAuthIsLoading(true);
        setError(null);
        try {
            const response = await loginService(email, senha);

            console.log('📝 Dados do usuário recebidos do login:', response.usuario);

            // Configurar header de autorização antes de buscar dados completos
            meetsApi.defaults.headers.common.Authorization = `Bearer ${response.token}`;

            // Buscar dados completos do usuário pela API
            let usuarioCompleto;
            try {
                usuarioCompleto = await getUserById(response.usuario.id);
                console.log('✅ Dados completos do usuário buscados:', usuarioCompleto);
            } catch (error) {
                console.warn('⚠️ Não foi possível buscar dados completos, usando dados do login');
                usuarioCompleto = response.usuario;
            }

            // Salvar token e usuário completo
            await AsyncStorage.setItem('meets-token', response.token);
            await AsyncStorage.setItem('meets-user', JSON.stringify(usuarioCompleto));

            setToken(response.token);
            setUser(usuarioCompleto);

            console.log('💾 Usuário salvo no contexto com todos os dados não sensíveis:', {
                id: usuarioCompleto.id,
                nome: usuarioCompleto.nome,
                email: usuarioCompleto.email,
                bio: usuarioCompleto.bio || null,
                fotoPerfil: usuarioCompleto.fotoPerfil || null,
                postagens: usuarioCompleto.postagens?.length || 0,
                // Outros campos que podem existir
                ...Object.keys(usuarioCompleto)
                    .filter(key => !['senha', 'password'].includes(key.toLowerCase()))
                    .reduce((obj, key) => {
                        if (!['id', 'nome', 'email', 'bio', 'fotoPerfil', 'postagens'].includes(key)) {
                            obj[key] = usuarioCompleto[key];
                        }
                        return obj;
                    }, {})
            });

            return { success: true, user: usuarioCompleto };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
            setError(errorMessage);
            console.error('❌ Erro no login:', error);
            return { success: false, error: errorMessage };
        } finally {
            setAuthIsLoading(false);
        }
    }

    async function register(nome, email, senha) {
        setAuthIsLoading(true);
        setError(null);
        try {
            const novoUsuario = await createUser({
                nome,
                email,
                senha
            });

            // Após criar, fazer login automático
            return await login(email, senha);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
            setError(errorMessage);
            console.error('Erro ao criar conta:', error);
            return { success: false, error: errorMessage };
        } finally {
            setAuthIsLoading(false);
        }
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem('meets-token');
            await AsyncStorage.removeItem('meets-user');
            setToken(null);
            setUser(null);
            delete meetsApi.defaults.headers.common.Authorization;
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    async function updateUser(userData) {
        try {
            // Atualizar estado local
            setUser(userData);
            
            // Atualizar AsyncStorage
            await AsyncStorage.setItem('meets-user', JSON.stringify(userData));
            
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            return { success: false, error: 'Erro ao atualizar dados do usuário' };
        }
    }

    return (
        <AuthContext.Provider value={{
            token,
            user,
            authIsLoading,
            error,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}