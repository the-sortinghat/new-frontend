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

  private sizeDimension() {
    this.system.services
      .reduce(
        (acc, { id, operations }) => [...acc, { serviceId: id, operations }],
        [] as { serviceId: number; operations: string[] }[]
      )
      .forEach(({ serviceId, operations }) => {
        operations.forEach((op) => {
          this.nodes.push({
            id: `op_${op}_from_s${serviceId}`,
            label: op,
            type: "operation",
          });

          this.edges.push({
            id: `op${op}/s${serviceId}`,
            source: `s${serviceId}`,
            target: `op_${op}_from_s${serviceId}`,
            type: "operation",
          });
        });
      });
  }

  private dataCouplingDimension() {
    this.nodes = this.nodes.concat(
      this.system.databasesUsages.map(({ databaseId, namespace }) => ({
        id: `db${databaseId}`,
        label: namespace,
        type: "database",
      }))
    );

    this.edges = this.edges.concat(
      this.system.databasesUsages.map(
        ({ serviceId, databaseId, accessType }) => {
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
  }

  private syncCouplingDimension() {
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
  }

  private asyncCouplingDimension() {
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
  }

  public static build(system: System, dimensions: Dimension[]): Graph {
    let processor = new GraphDataProcessor(system);
    const buildOptions = {
      [Dimension.SIZE]() {
        processor.sizeDimension();
      },
      [Dimension.DATA_COUPLING]() {
        processor.dataCouplingDimension();
      },
      [Dimension.SYNC_COUPLING]() {
        processor.syncCouplingDimension();
      },
      [Dimension.ASYNC_COUPLING]() {
        processor.asyncCouplingDimension();
      },
    };

    dimensions.forEach((dimension) => buildOptions[dimension]());

    return { nodes: processor.nodes, edges: processor.edges };
  }
}
