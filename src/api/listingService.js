import api from './axiosInstance';

export const getListing = (queryString) => {
    return api.get(`/properties/search?${queryString}`).then((res) => res.data);
};

export const getPropertyDetails = (id) => {
    return api.get(`/properties/details/${id}`).then((res) => res.data);
};

export const scheduleViewing = (data) => {
    return api.post('/viewings/schedule', data).then((res) => res.data);
};

export const registerObserver = (id, email) => {
    return api
        .post(`/properties/${id}/registerObserver?email=${email}`)
        .then((res) => res.data);
};
