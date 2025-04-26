import api from './axiosInstance';
import { getToken } from '@/utils/auth';

export const getListing = (queryString) => {
    return api.get(`/properties/search?${queryString}`).then((res) => res.data);
};

export const getPropertyDetails = (id) => {
    const token = getToken();

    if (token) {
        return api
            .get(`/properties/details/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => res.data);
    }
    return api.get(`/properties/details/${id}`).then((res) => res.data);
};

export const scheduleViewing = (data) => {
    return api.post('/viewings/schedule', data).then((res) => res.data);
};

export const registerObserver = ({ id, email }) => {
    const token = getToken();

    return api
        .post(`/properties/${id}/registerObserver?email=${email}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const createProperty = ({ propertyType, formDataToSend }) => {
    const token = getToken();
    return api.post(
        `/properties?propertyType=${propertyType}`,
        formDataToSend,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};

export const getOwned = () => {
    const token = getToken();

    return api
        .get('/properties/owned', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getSavedList = () => {
    const token = getToken();

    return api
        .get('/properties/favorites', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};
