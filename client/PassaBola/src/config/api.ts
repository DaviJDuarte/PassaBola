import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("access_token");
            // TODO - Melhorar redirecionamento. Mostrar mensagem de erro na autenticação e abrir modal de login.
            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }
        return Promise.reject(error);
    }
);


export default api;