import { Node, Edge, Graph } from "../types/graph";
import { DatabaseAccessType, Operation, System } from "../types/system";

export default class GraphProcessor {
  private nodes: Node[] = [];
  private edges: Edge[] = [];

  constructor(private readonly system: System) {
    this.nodes = this.nodes
      .concat(
        system.services.map(({ id, name, moduleId }) => ({
          id: `s${id}`,
          label: name,
          type: "service",
          parent: `m${moduleId}`,
        }))
      )
      .concat(
        system.modules.map(({ id, name }) => ({
          id: `m${id}`,
          label: name,
          type: "module",
        }))
      );
  }

  public sizeDimension(): GraphProcessor {
    this.nodes.forEach((node) => {
      node.operations = this.system.services.find(
        (s) => s.id === node.id
      )?.operations;
    });

    return this;
  }

  public dataCouplingDimension(): GraphProcessor {
    this.nodes = this.nodes.concat(
      this.system.databasesUsages.map(({ databaseId, namespace }) => ({
        id: `db${databaseId}`,
        label: namespace,
        type: "database",
      }))
    );

    this.edges = this.edges.concat(
      this.system.databasesUsages.map(
        ({ serviceId, databaseId, accessType, namespace }) => {
          const id = `db${databaseId}/s${serviceId}`;
          const source = `s${serviceId}`;
          const target = `db${databaseId}`;
          const label = `${
            accessType === DatabaseAccessType.readAndWrite
              ? "R/W"
              : accessType === DatabaseAccessType.read
              ? "R"
              : "W"
          }`;
          const type = "db";

          return {
            id,
            source,
            target,
            label,
            type,
          };
        }
      )
    );

    return this;
  }

  public syncCouplingDimension(): GraphProcessor {
    this.edges = this.edges.concat(
      this.system.syncOperations.map(
        ({ from, to }: Operation): Edge => ({
          id: `sync-s${from}/s${to}`,
          source: `s${from}`,
          target: `s${to}`,
          type: "sync",
        })
      )
    );

    return this;
  }

  public asyncCouplingDimension(): GraphProcessor {
    this.edges = this.edges.concat(
      this.system.asyncOperations.map(
        ({ from, to }: Operation): Edge => ({
          id: `async-s${from}/s${to}`,
          source: `s${from}`,
          target: `s${to}`,
          type: "async",
        })
      )
    );

    return this;
  }

  public build(): Graph {
    return { nodes: this.nodes, edges: this.edges };
  }
}
