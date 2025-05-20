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
import { ProtectedRoutes } from './ProtectedRoutes';
import { PaymentSuccessPage } from '@/pages/User/PaymentSuccessPage';
import { EditPropertyPage } from '@/pages/User/EditPropertyPage';
import { ListingPlanPage } from '@/pages/User/ListingPlanPage';
import { AdminLayout } from '@/layout/AdminLayout';
import { DashboardPage } from '@/pages/Admin/DashboardPage';
import { ListingManagementPage } from '@/pages/Admin/ListingManagementPage';
import { UserMangamentPage } from '@/pages/Admin/UserMangamentPage';
import { RentalManagementPage } from '@/pages/Admin/RentalManagementPage';
import { SalesMangementPage } from '@/pages/Admin/SalesMangementPage';
import { PaymentManagementPage } from '@/pages/Admin/PaymentManagementPage';

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'list', element: <ListPage /> },
            { path: 'list/:id', element: <PropertyDetails /> },
            {
                path: 'profile',
                element: (
                    <ProtectedRoutes>
                        <Profile />
                    </ProtectedRoutes>
                )
            },
            { path: 'sign-up', element: <SignUpPage /> },
            { path: 'sign-in', element: <SignInPage /> },
            {
                path: 'add-post',
                element: (
                    <ProtectedRoutes>
                        <AddPostPage />
                    </ProtectedRoutes>
                )
            },
            {
                path: 'edit/:id',
                element: (
                    <ProtectedRoutes>
                        <EditPropertyPage />
                    </ProtectedRoutes>
                )
            },
            {
                path: 'payment-success',
                element: (
                    <ProtectedRoutes>
                        <PaymentSuccessPage />
                    </ProtectedRoutes>
                )
            },
            {
                path: 'listing-plan',
                element: (
                    <ProtectedRoutes>
                        <ListingPlanPage />
                    </ProtectedRoutes>
                )
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoutes>
                <AdminLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: '',
                element: <DashboardPage />
            },
            { path: 'listing-management', element: <ListingManagementPage /> },
            { path: 'user-management', element: <UserMangamentPage /> },
            { path: 'payment-management', element: <PaymentManagementPage /> },
            { path: 'rental-management', element: <RentalManagementPage /> },
            { path: 'sales-management', element: <SalesMangementPage /> }
        ]
    }
]);
