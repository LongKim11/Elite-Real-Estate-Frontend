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
