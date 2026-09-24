import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

export default function AuthGuard({ children }) {
    const { token, ready } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (ready && !token) navigate('/login', { replace: true });
    }, [ready, token, navigate]);

    if (!ready) return <Loader center />;
    if (!token) return null;
    return <>{children}</>;
}