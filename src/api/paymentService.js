import api from './axiosInstance';
import { getToken } from '@/utils/auth';

export const createPayment = (amount) => {
    const token = getToken();

    return api
        .post(`/payment/create?amount=${amount}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getPaymentHistory = () => {
    const token = getToken();

    return api
        .get('/payment/phone', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getAllPayment = () => {
    const token = getToken();

    return api
        .get('/payment', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};
