import { ClassType } from ".";

export interface TechsMap {
  [key: string]: ClassType;
}

export interface TechApi {
  destroy: () => void;
}
