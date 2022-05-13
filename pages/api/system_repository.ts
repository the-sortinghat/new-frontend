import { metrics, systems } from "./data";
import { System, SystemMetrics } from "../../types/system";

export const getAllSystems = (): System[] => systems;

export const findSystemById = (id: number): System | undefined =>
  systems.find((system) => system.id === id);

export const getSystemMetrics = (id: number): SystemMetrics | undefined =>
  metrics.find(({ systemId }) => id === systemId);
