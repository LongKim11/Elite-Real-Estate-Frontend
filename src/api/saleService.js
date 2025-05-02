import api from './axiosInstance';
import { getToken } from '@/utils/auth';

export const getAllListingPlanByUser = () => {
    const token = getToken();

    return api
        .get('/user-post-quotas', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const purchaseListingPlan = (data) => {
    const token = getToken();

    return api
        .post('/user-post-quotas', data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getValidListingPlanByUser = () => {
    const token = getToken();

    return api
        .get('/user-post-quotas/valid', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const postPayment = (data) => {
    const token = getToken();

    return api
        .post('/post-payments/handle', data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const getPostPaymentHistory = () => {
    const token = getToken();

    return api
        .get('/post-payments/user', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};
