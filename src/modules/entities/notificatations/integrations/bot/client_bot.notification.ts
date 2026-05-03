import axios from "axios";

const api = axios.create({
    baseURL: process.env.TG_BOT_API_BASE_URL,
    timeout: 5000
});

api.interceptors.request.use((config) => {
    const token = process.env.TG_BOT_API_TOKEN;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;