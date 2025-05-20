import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, isTokenValid, removeToken } from '@/utils/auth';
import useAuthStore from '@/store/useAuthStore';
import { Spinner } from '@/components/Spinner';

export const ProtectedRoutes = ({ children }) => {
    const clearUser = useAuthStore((state) => state.clearUser);
    const [authState, setAuthState] = useState({
        isChecking: true,
        isAuthenticated: false
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            if (!token || !isTokenValid(token)) {
                removeToken();
                clearUser();
                setAuthState({ isChecking: false, isAuthenticated: false });
            } else {
                setAuthState({ isChecking: false, isAuthenticated: true });
            }
        };

        checkAuth();
    }, [clearUser]);

    if (authState.isChecking) {
        return <Spinner />;
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }

    return children;
};
