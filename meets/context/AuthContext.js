import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meetsApi } from '../src/libs/api.js';
import { login as loginService } from '../src/service/authService.js';
import { createUser } from '../src/service/userService.js';

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
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    meetsApi.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
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

            // Salvar token e usuário
            await AsyncStorage.setItem('meets-token', response.token);
            await AsyncStorage.setItem('meets-user', JSON.stringify(response.usuario));

            setToken(response.token);
            setUser(response.usuario);

            // Configurar header de autorização
            meetsApi.defaults.headers.common.Authorization = `Bearer ${response.token}`;

            return { success: true, user: response.usuario };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
            setError(errorMessage);
            console.error('Erro no login:', error);
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

    return (
        <AuthContext.Provider value={{
            token,
            user,
            authIsLoading,
            error,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}