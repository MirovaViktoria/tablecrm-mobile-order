import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        // Check for token in URL path (e.g., /<token>)
        // This handles the case where the user visits https://app.com/<token>
        const path = window.location.pathname;
        const potentialToken = path.substring(1); // Remove leading slash

        // Basic validation: TableCRM tokens seem to be long hex strings (e.g. 64 chars)
        // We'll check if it looks like a token (alphanumeric, reasonable length)
        if (potentialToken && potentialToken.length > 20 && /^[a-z0-9]+$/i.test(potentialToken)) {
            localStorage.setItem('tablecrm_token', potentialToken);
            return potentialToken;
        }

        return localStorage.getItem('tablecrm_token') || '';
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('tablecrm_token', token);
        } else {
            localStorage.removeItem('tablecrm_token');
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken('');
        // Optional: Clear URL if it contained the token
        if (window.location.pathname.length > 1) {
            window.history.pushState({}, '', '/');
        }
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
