import axios, { AxiosError, InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import { auth } from "../firebaseClient";
import { getAuthUser } from "../auth/getAuthUser";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = (baseURL: string): AxiosInstance => {
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 10000,
    });

    api.interceptors.request.use(async(config) => {
        const user = auth.currentUser ?? (await getAuthUser());
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const status = error.response?.status;
            const config = error.config as RetryableConfig | undefined;
            
            if (!config || config._retry || (status !== 401 && status !== 403)) {
                throw error;
            }

            const user = auth.currentUser;
            if (!user)throw error;
            const token = await user.getIdToken(true);
            config.headers.Authorization = `Bearer ${token}`;
            return api.request(config);
        }
    )
    return api;
}