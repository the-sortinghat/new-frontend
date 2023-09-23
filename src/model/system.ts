interface Module {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  responsibility: string;
  operations: string[];
  moduleId: string;
}

interface Database {
  id: string;
  model: string;
}

interface DatabaseUsage {
  databaseId: string;
  serviceId: string;
  namespace: string;
  accessType: string;
}

interface Operation {
  from: string;
  to: string;
  label: string;
}

export interface System {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  services: Service[];
  databases: Database[];
  databasesUsages: DatabaseUsage[];
  syncOperations: Operation[];
  asyncOperations: Operation[];
}
