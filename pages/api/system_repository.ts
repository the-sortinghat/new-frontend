import { systems } from "./data";
import { System } from "./domain/model";

export const getAllSystems = (): System[] => systems;

export const findSystemById = (id: number): System | undefined =>
  systems.find((system) => system.id === id);
