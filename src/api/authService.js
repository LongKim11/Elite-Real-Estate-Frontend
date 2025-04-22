import api from './axiosInstance';
import { setToken } from '@/utils/auth';
import useAuthStore from '@/store/useAuthStore';

export const register = (data) => {
    return api.post('/auth/register', data).then((res) => res.data);
};

export const login = async (data) => {
    const res = await api.post('/auth/login', data);

    const { id, token, role } = res.data.data;
    const message = res.data.message;

    setToken(token);

    useAuthStore.getState().setUser({ id, name: '' });

    return { id, message, role };
};
