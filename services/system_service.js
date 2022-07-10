import { api } from "./axios";

export const getAllSystems = async () => (await api.get("/systems")).data;
export const getSystemById = async (id) =>
  (await api.get(`/systems/${id}`)).data;
export const getSystemMetrics = async (id) =>
  (await api.get(`/systems/${id}/metrics`)).data;
