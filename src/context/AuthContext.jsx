import {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('auth_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const userData = await api.fetchCurrentUser();
            setUser(userData);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            Cookies.remove('auth_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await api.login(credentials);
            Cookies.set('auth_token', response.token, {expires: 7});
            setUser(response.user);
            navigate('/');
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await api.register(userData);
            Cookies.set('auth_token', response.token, {expires: 7});
            setUser(response.user);
            navigate('/');
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
            throw err;
        }
    };

    const logout = () => {
        Cookies.remove('auth_token');
        // Cookies.clear('auth_token');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};