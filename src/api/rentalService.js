import api from './axiosInstance';
import { getToken } from '@/utils/auth';

export const scheduleViewing = (data) => {
    return api.post('/view-schedule', data).then((res) => res.data);
};

export const getPropertySchedule = (propertyId) => {
    const token = getToken();

    return api
        .get(`/view-schedule/property/${propertyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const updateScheduleStatus = (id, status) => {
    const token = getToken();

    return api
        .put(`/view-schedule/${id}/${status}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const deleteSchedule = (id) => {
    const token = getToken();

    return api
        .delete(`/view-schedule/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};

export const cancelSchedule = (id) => {
    const token = getToken();

    return api
        .delete(`/view-schedule/${id}/cancel`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.data);
};
