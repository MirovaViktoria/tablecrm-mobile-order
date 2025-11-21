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
            // Add token to params for all requests as per API requirements

            config.params = { ...config.params, token };
            config.headers['Authorization'] = `Bearer ${token}`;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
