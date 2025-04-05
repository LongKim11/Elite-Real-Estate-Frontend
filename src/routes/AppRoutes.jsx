import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { HomePage } from '@/pages/User/HomePage';
import { ListPage } from '@/pages/User/ListPage';
import { PropertyDetails } from '@/pages/User/PropertyDetails';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'list', element: <ListPage /> },
            { path: 'list/:id', element: <PropertyDetails /> },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);
