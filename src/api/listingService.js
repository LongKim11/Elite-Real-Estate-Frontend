import api from './axiosInstance';

export const getListing = () => {
    return api.get('/properties/search').then((res) => res.data);
};

export const getPropertyDetails = (id) => {
    return api.get(`/properties/details/${id}`).then((res) => res.data);
};
