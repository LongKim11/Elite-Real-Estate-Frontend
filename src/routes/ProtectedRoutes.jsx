import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid, removeToken } from '@/utils/auth';
import useAuthStore from '@/store/useAuthStore';

export const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        const token = getToken();
        if (!token || !isTokenValid(token)) {
            removeToken();
            clearUser();
            navigate('/sign-in');
        }
    }, [navigate]);

    return children;
};
