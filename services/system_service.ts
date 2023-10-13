import { api } from "./axios";

export const getAllSystems = async () => (await api.get("/systems")).data;
export const getSystemById = async (id: string) =>
  (await api.get(`/systems/${id}`)).data;
export const getSystemMetrics = async (id: string) =>
  (await api.get(`/systems/${id}/metrics`)).data;
export const registerNewSystem = async (repoUrl: string, filename: string) =>
  await api.post("/systems", { repoUrl, filename });
export const registerSystemEndpoints = async (
  repoUrl: string,
  systemName: string,
  servicesAndOpenApiFilenames: any
) =>
  await api.put(`/systems/${systemName}/endpoints`, {
    repoUrl,
    servicesAndOpenApiFilenames,
  });
