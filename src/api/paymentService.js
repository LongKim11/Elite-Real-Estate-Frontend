import api from './axiosInstance';

export const createPayment = (amount) => {
    return api.post(`/payment/create?amount=${amount}`).then((res) => res.data);
};
