import api from './axiosInstance';

export const register = (data) => {
    return api.post('/auth/register', data).then((res) => res.data);
};
