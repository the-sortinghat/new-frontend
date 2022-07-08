import { Edge, Graph, Node } from "@/types/graph";
import {
  DatabaseAccessType,
  Dimension,
  Operation,
  System,
} from "@/types/system";

export default class GraphDataProcessor {
  private nodes: Node[] = [];
  private edges: Edge[] = [];

  private constructor(private readonly system: System) {
    this.nodes = this.nodes
      .concat(
        system.services.map(({ id, name, moduleId, operations }) => ({
          id: `s${id}`,
          label: name,
          type: "service",
          parent: `m${moduleId}`,
          operations: operations,
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

  private dataCouplingDimension(): GraphDataProcessor {
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

  private syncCouplingDimension(): GraphDataProcessor {
    this.edges = this.edges.concat(
      this.system.syncOperations.map(
        ({ from, to, label }: Operation): Edge => ({
          id: `sync-s${from}/s${to}`,
          source: `s${from}`,
          target: `s${to}`,
          type: "sync",
          label,
        })
      )
    );

    return this;
  }

  private asyncCouplingDimension(): GraphDataProcessor {
    this.edges = this.edges.concat(
      this.system.asyncOperations.map(
        ({ from, to, label }: Operation): Edge => ({
          id: `async-s${from}/s${to}`,
          source: `s${from}`,
          target: `s${to}`,
          type: "async",
          label,
        })
      )
    );

    return this;
  }

  public static build(system: System, dimensions: Dimension[]): Graph {
    let processor = new GraphDataProcessor(system);
    const buildOptions = {
      [Dimension.SIZE]() {},
      [Dimension.DATA_COUPLING]() {
        processor = processor.dataCouplingDimension();
      },
      [Dimension.SYNC_COUPLING]() {
        processor = processor.syncCouplingDimension();
      },
      [Dimension.ASYNC_COUPLING]() {
        processor = processor.asyncCouplingDimension();
      },
    };

    dimensions.forEach((dimension) => buildOptions[dimension]());

    return { nodes: processor.nodes, edges: processor.edges };
  }
}
