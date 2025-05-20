import api from './axiosInstance';
import { getToken, setToken } from '@/utils/auth';
import useAuthStore from '@/store/useAuthStore';

export const register = (data) => {
    return api.post('/auth/register', data).then((res) => res.data);
};

export const login = async (data) => {
    const res = await api.post('/auth/login', data);

    const { id, token, role, name } = res.data.data;
    const message = res.data.message;

    setToken(token);

    useAuthStore.getState().setUser({ id, name, role });

    return { id, message, role };
};

export const getMe = () => {
    const token = getToken();
    return api
        .get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getAllUsers = () => {
    const token = getToken();
    return api
        .get('/auth/admin/get-all-users', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const deleteUser = (id) => {
    const token = getToken();

    return api
        .delete(`/auth/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getOverviewStatistics = () => {
    const token = getToken();

    return api
        .get('/overview-statistics', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};
