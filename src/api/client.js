import axios from 'axios';

const BASE_URL = '/api/v1/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tablecrm_token');
        if (token) {
            // The API seems to expect the token in the query params for some requests based on the user description
            // "Request URL ...?token=..."
            // But usually APIs use headers. I'll add it to params for now as per the example URL.
            // However, for POST requests it might be different.
            // Let's check if we can add it to params safely for all requests.
            config.params = { ...config.params, token };
            config.headers['Authorization'] = `Bearer ${token}`; // Try Bearer first
            // config.headers['X-Token'] = token; // Alternative if Bearer fails
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
