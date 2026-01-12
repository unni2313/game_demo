import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);
export const getUserProfile = (id) => api.get(`/users/userwithrank/${id}`);
export const addScore = (scoreData) => api.post('/game/add-score', scoreData);
export const getLeaderboard = () => api.get('/game/leaderboard');

export default api;
