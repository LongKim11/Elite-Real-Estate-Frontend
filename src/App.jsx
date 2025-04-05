import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './routes/AppRoutes';

function App() {
    return <RouterProvider router={AppRouter}></RouterProvider>;
}

export default App;
