import { DatabaseAccessType, System } from "./domain/model";

export const systems: System[] = [
  {
    id: 1,
    name: "InterSCity",
    description:
      "InterSCity platform, an open-source, microservices-based middleware to support the development of smart city applications and to enable novel, reproducible research, and experiments in this field.",
    modules: [
      { id: 1, name: "Actuator Controller" },
      { id: 2, name: "Data Collector" },
      { id: 3, name: "Resource Adaptor" },
      { id: 4, name: "Resource Catalog" },
      { id: 5, name: "Resource Discovery" },
    ],
    services: [
      {
        id: 1,
        name: "Actuator Controller",
        responsibility: "",
        operations: "GET /actuator/commands, POST /actuator/commands".split(
          ", "
        ),
        moduleId: 1,
      },
      {
        id: 2,
        name: "Data Collector",
        responsibility: "",
        operations:
          "POST /collector/resources/data, POST /collector/resources/{uuid}/data, POST /collector/resources/data/last, POST /collector/resources/{uuid}/data/last".split(
            ", "
          ),
        moduleId: 2,
      },
      {
        id: 3,
        name: "Resource Adaptor",
        responsibility: "",
        operations:
          "POST /adaptor/resources, PUT /adaptor/resources/{uuid}, POST /adaptor/resources/{uuid}/data, POST /adaptor/resources/{uuid}/data/{capability}, POST /adaptor/subscriptions, GET /adaptor/subscriptions, PUT /adaptor/subscriptions/{id}, GET /adaptor/subscriptions/{id}".split(
            ", "
          ),
        moduleId: 3,
      },
      {
        id: 4,
        name: "Resource Catalog",
        responsibility: "",
        operations:
          "GET /catalog/resources, POST /catalog/resources, GET /catalog/resources/sensors, GET /catalog/resources/actuators, GET /catalog/resources/search, PUT /catalog/resources/{uuid}, GET /catalog/resources/{uuid}, GET /catalog/capabilities, POST /catalog/capabilities, GET /catalog/capabilities/{name}, PUT /catalog/capabilities/{name}, DELETE/catalog/capabilities/{name}".split(
            ","
          ),
        moduleId: 4,
      },
      {
        id: 5,
        name: "Resource Discovery",
        responsibility: "",
        operations: "GET /discovery/resources".split(", "),
        moduleId: 5,
      },
    ],
    databases: [
      { id: 1, model: "MongoDB - Document oriented" },
      { id: 2, model: "MongoDB - Document oriented" },
      { id: 3, model: "MongoDB - Document oriented" },
      { id: 4, model: "Postgres - Relational" },
      { id: 5, model: "Redis - Key-value" },
      { id: 6, model: "Postgres - Relational" },
      { id: 7, model: "Redis - Key-value" },
      { id: 8, model: "Redis - Key-value" },
    ],
    databasesUsages: [
      {
        databaseId: 1,
        serviceId: 1,
        role: "principal",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "actuator-controller-mongo",
      },
      {
        databaseId: 2,
        serviceId: 2,
        role: "principal",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "data-collector-mongo",
      },
      {
        databaseId: 3,
        serviceId: 2,
        role: "cache",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "data-collector-cache",
      },
      {
        databaseId: 4,
        serviceId: 3,
        role: "principal",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "resource-adaptor-pg",
      },
      {
        databaseId: 5,
        serviceId: 3,
        role: "cache",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "resource-adaptor-redis",
      },
      {
        databaseId: 6,
        serviceId: 4,
        role: "principal",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "resource-cataloguer-pg",
      },
      {
        databaseId: 7,
        serviceId: 4,
        role: "cache",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "resource-cataloguer-redis",
      },
      {
        databaseId: 8,
        serviceId: 5,
        role: "cache",
        accessType: DatabaseAccessType.readAndWrite,
        namespace: "resource-discovery-redis",
      },
    ],
    syncOperations: [
      {
        from: 3,
        to: 4,
        label:
          "POST /catalog/resources, PUT /catalog/resources/{uuid}, GET /catalog/resources/{uuid}",
      },
      { from: 5, to: 2, label: "POST /collector/resources/data" },
      { from: 5, to: 4, label: "GET /catalog/resources/search" },
    ],
    asyncOperations: [
      { from: 1, to: 3, label: "ActuatorCommandNotifier" },
      { from: 3, to: 1, label: "ActuatorCommandUpdater" },
      { from: 3, to: 2, label: "DataReceiver" },
      { from: 3, to: 4, label: "LocationUpdater" },
      { from: 4, to: 1, label: "ResourceCreator, ResourceUpdater" },
      { from: 4, to: 2, label: "ResourceCreator, ResourceUpdater" },
    ],
  },
];
