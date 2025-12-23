import { apiClient } from "./apiClient";
export const api = apiClient(process.env.NEXT_PUBLIC_API_TARGET ?? 'http://192.168.0.35:4250');