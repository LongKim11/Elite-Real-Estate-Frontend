import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { HomePage } from '@/pages/User/HomePage';
import { ListPage } from '@/pages/User/ListPage';
import { PropertyDetails } from '@/pages/User/PropertyDetails';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Profile } from '@/pages/User/Profile';
import { SignUpPage } from '@/pages/User/SignUpPage';
import { SignInPage } from '@/pages/SignInPage';
import { AddPostPage } from '@/pages/User/AddPostPage';

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'list', element: <ListPage /> },
            { path: 'list/:id', element: <PropertyDetails /> },
            { path: 'profile', element: <Profile /> },
            { path: '/sign-up', element: <SignUpPage /> },
            { path: '/sign-in', element: <SignInPage /> },
            { path: '/add-post', element: <AddPostPage /> },

            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);
