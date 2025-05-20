import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

export const AppLayout = () => {
    return (
        <div className="mx-auto flex h-screen flex-col">
            <div>
                <Navbar />
            </div>
            <div className="h-[calc(100vh-100px)] overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};
