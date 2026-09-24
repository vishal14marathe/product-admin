import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken, clearToken } from '../lib/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() => getToken());
    const [ready, setReady] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const sync = () => setTokenState(getToken());
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const login = (t) => {
        setToken(t);
        setTokenState(t);
    };

    const logout = () => {
        clearToken();
        setTokenState(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ token, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}