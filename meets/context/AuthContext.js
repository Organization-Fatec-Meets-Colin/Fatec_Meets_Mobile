import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const [authIsLoading, setAuthIsLoading] = useState(false);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, authIsLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}