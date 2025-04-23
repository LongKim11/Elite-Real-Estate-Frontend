import api from './axiosInstance';

export const getListing = () => {
    return api.get('/properties/search').then((res) => res.data);
};
