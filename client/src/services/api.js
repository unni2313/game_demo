import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);
export const addScore = (scoreData) => api.post('/game/add-score', scoreData);
export const getLeaderboard = () => api.get('/game/leaderboard');

export default api;
