import api from './axiosInstance';

export const scheduleViewing = (data) => {
    return api.post('/view-schedule', data).then((res) => res.data);
};
