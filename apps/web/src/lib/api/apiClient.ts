import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { getAuthUser } from "../auth/getAuthUser";
import { auth } from "../firebaseClient";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = (baseURL: string): AxiosInstance => {
	const api = axios.create({
		baseURL: baseURL,
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 10000,
	});

	api.interceptors.request.use(async (config) => {
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
			const config = error.config as
				| (InternalAxiosRequestConfig & RetryableConfig)
				| undefined;

			if (!config) throw error;

			if (status !== 401 && status !== 403) throw error;

			if (config._retry) throw error;
			config._retry = true;

			const user = auth.currentUser ?? (await getAuthUser());
			if (!user) throw error;

			const fresh = await user.getIdToken(true);

			config.headers.Authorization = `Bearer ${fresh}`;
			return api.request(config);
		},
	);
	return api;
};
