import React, { createContext, useContext, useState, useEffect } from 'react';

interface ITokenContext {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

const TokenContext = createContext<ITokenContext | undefined>(undefined);

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within a TokenProvider');
    }
    return context;
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setTokenState(savedToken);
        }
    }, []);

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        localStorage.setItem('token', newToken);
    };

    const clearToken = () => {
        setTokenState(null);
        localStorage.removeItem('token');
    };

    return (
        <TokenContext.Provider value={{ token, setToken, clearToken }}>
            {children}
        </TokenContext.Provider>
    );
};
