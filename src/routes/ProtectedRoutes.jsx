import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedRoutes = ({ element }) => {
    const navigate = useNavigate();

    // Check if not login - return Navigate to it

    return element;
};
