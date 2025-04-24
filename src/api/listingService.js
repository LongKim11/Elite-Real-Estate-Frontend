import api from './axiosInstance';

export const getListing = (queryString) => {
    console.log('Query String', queryString);
    return api.get(`/properties/search?${queryString}`).then((res) => res.data);
};

export const getPropertyDetails = (id) => {
    return api.get(`/properties/details/${id}`).then((res) => res.data);
};
