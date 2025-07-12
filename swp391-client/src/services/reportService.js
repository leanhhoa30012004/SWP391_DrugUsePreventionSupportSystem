import axiosInstance from '../config/axios/axiosInstance';

export const getActiveMembers = () => axiosInstance.get('/manager/report/active-members');
export const getSurveyDone = (period, date, year, week, month) =>
  axiosInstance.get(`/manager/report/survey-done/${period}/${date}/${year}/${week}/${month}`);
