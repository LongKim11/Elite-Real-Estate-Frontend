import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid } from '@/utils/auth';

export const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token || !isTokenValid(token)) {
            navigate('/sign-in');
        }
    }, [navigate]);

    return children;
};
