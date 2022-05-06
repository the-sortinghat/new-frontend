export type Operation = {
  from: number;
  to: number;
  label: string;
};

export type Module = {
  id: number;
  name: string;
};

export type Service = {
  id: number;
  name: string;
  responsibility: string;
  operations: string[];
  moduleId: number;
};

export type Database = {
  id: number;
  model: string;
};

export enum DatabaseAccessType {
  read,
  write,
  readAndWrite,
}

export type DatabaseUsage = {
  databaseId: number;
  serviceId: number;
  role: string;
  accessType: DatabaseAccessType;
  namespace: string;
};

export type Component = {
  modules: number;
  services: number;
};

export type SizeMetrics = {
  "Number of system’s components": Component;
  "Number of services per modules": number;
  "Number of services with deployment dependency": number;
  "Number of operations per component": Component;
  "Largest service": string;
  "Smallest service": string;
};

export type DataCouplingMetrics = {
  "Number of data sources per component": number;
  "Number of data sources that each component share with others": number;
  "Number of data sources where each component performs write-only operations": number;
  "Number of data sources where each component performs read-only operations": number;
  "Number of data sources where each component performs read and operations": number;
};

export type SyncCouplingMetrics = {
  "Number of clients that invoke the operations of a given component": number;
  "Number of components from which a given component invokes operations": number;
  "Number of different operations invoked by each depending component": number;
  "Number of different operations invoked from other components": number;
};

export type AsyncCouplingMetrics = {
  "Number of clients that consume messages published by a given component": number;
  "Number of components from which a given component consumes messages": number;
  "Number of different types of messages consumed by each depending component": number;
  "Number of different types of messages consumed from other components": number;
  "Number of components that consume messages from the queue": number;
  "Number of components that publish messages in the queue": number;
};

export type SystemMetrics = {
  Size: SizeMetrics;
  "Data source coupling": DataCouplingMetrics;
  "Synchronous coupling": SyncCouplingMetrics;
  "Asynchronous coupling": AsyncCouplingMetrics;
};

export type System = {
  id: number;
  name: string;
  description: string;
  modules: Module[];
  services: Service[];
  databases: Database[];
  databasesUsages: DatabaseUsage[];
  syncOperations: Operation[];
  asyncOperations: Operation[];
  //metrics: SystemMetrics;
};
