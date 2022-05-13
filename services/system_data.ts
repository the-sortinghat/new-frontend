import { api } from "./axios";

export const getAllSystems = async () => (await api.get("/api/systems")).data;
export const getSystemById = async (id: string) =>
  (await api.get(`/api/systems/${id}`)).data;
export const getSystemMetrics = async (id: string) =>
  (await api.get(`/api/systems/${id}/metrics`)).data;
