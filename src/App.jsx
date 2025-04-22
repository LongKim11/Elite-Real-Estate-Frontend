import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
    return (
        <>
            <RouterProvider router={AppRouter}></RouterProvider>
            <Toaster richColors />
        </>
    );
}

export default App;
