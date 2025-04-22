import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedRoutes = ({ element }) => {
    const navigate = useNavigate();

    return element;
};
