import { Dimension, Dimensions } from "@/types/dimensions";
import { Node, Edge, Graph } from "@/types/graph";
import { DatabaseAccessType, Operation, System } from "@/types/system";

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

  private sizeDimension(): GraphDataProcessor {
    this.nodes.forEach((node) => {
      node.operations = this.system.services.find(
        (s) => s.id === node.id
      )?.operations;
    });

    return this;
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

  private asyncCouplingDimension(): GraphDataProcessor {
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

  public static build(system: System, dimensions: Dimensions): Graph {
    let processor = new GraphDataProcessor(system);
    const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;
    const buildOptions = {
      [SIZE]() {
        processor = processor.sizeDimension();
      },
      [DATA_COUPLING]() {
        processor = processor.dataCouplingDimension();
      },
      [SYNC_COUPLING]() {
        processor = processor.syncCouplingDimension();
      },
      [ASYNC_COUPLING]() {
        processor = processor.asyncCouplingDimension();
      },
    };

    dimensions.forEach((dimension) => buildOptions[dimension]());

    return { nodes: processor.nodes, edges: processor.edges };
  }
}
