import { api } from "@/services/axios";

export const getAllSystems = async () => (await api.get("/systems")).data;
export const getSystemById = async (id: string) =>
  (await api.get(`/systems/${id}`)).data;
export const getSystemMetrics = async (id: string) =>
  (await api.get(`/systems/${id}/metrics`)).data;
