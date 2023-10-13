import { DatabaseAccessType, Dimension } from "@common/index";
import { curveOverlappingLinks } from "./graph_utils";

export default class GraphDataProcessor {
  public nodes: any[];
  public edges: any[];
  public components: any[];
  public databasesUsages: any[];
  public syncOperations: any[];
  public asyncOperations: any[];

  constructor(system: any, componentType = "service") {
    this.nodes = [];
    this.edges = [];
    this.components = [];
    this.databasesUsages = [];
    this.syncOperations = [];
    this.asyncOperations = [];

    if (componentType === "module") {
      this.components = system.modules.map((m: any) => ({
        ...m,
        id: `m${m.id}`,
        type: "module",
        operations: system.services
          .filter((s: any) => s.moduleId === m.id)
          .reduce(
            (acc: any, { operations }: any) => [...acc, ...operations],
            []
          ),
      }));
      this.databasesUsages = system.databasesUsages.map((usage: any) => ({
        ...usage,
        componentId: `m${
          system.services.find((s: any) => s.id === usage.serviceId).moduleId
        }`,
      }));
      this.syncOperations = system.syncOperations.map(
        ({ from, to, label }: any) => ({
          from: `m${system.services.find((s: any) => s.id === from).moduleId}`,
          to: `m${system.services.find((s: any) => s.id === to).moduleId}`,
          label,
        })
      );
      this.asyncOperations = system.asyncOperations.map(
        ({ from, to, label }: any) => ({
          from: `m${system.services.find((s: any) => s.id === from).moduleId}`,
          to: `m${system.services.find((s: any) => s.id === to).moduleId}`,
          label,
        })
      );
    } else {
      this.components = system.services.map((s: any) => ({
        ...s,
        id: `s${s.id}`,
        type: "service",
      }));
      this.databasesUsages = system.databasesUsages.map((usage: any) => ({
        ...usage,
        componentId: `s${usage.serviceId}`,
      }));
      this.syncOperations = system.syncOperations.map(
        ({ from, to, label }: any) => ({
          from: `s${from}`,
          to: `s${to}`,
          label,
        })
      );
      this.asyncOperations = system.asyncOperations.map(
        ({ from, to, label }: any) => ({
          from: `s${from}`,
          to: `s${to}`,
          label,
        })
      );
    }

    this.nodes = this.nodes.concat(
      this.components.map(({ id, name, type, operations }) => ({
        id,
        label: name,
        type,
        operations,
      }))
    );
  }

  #sizeDimension() {
    this.components.forEach((comp) => {
      comp.operations.forEach((op: any) => {
        this.nodes.push({
          id: `op_${op}_from_${comp.id}`,
          label: op,
          type: "operation",
        });

        this.edges.push({
          id: `op${op}/${comp.id}`,
          source: comp.id,
          target: `op_${op}_from_${comp.id}`,
          type: "operation",
        });
      });
    });
  }

  #dataCouplingDimension() {
    this.nodes = this.nodes.concat(
      this.databasesUsages.map(({ databaseId, namespace }) => ({
        id: `db${databaseId}`,
        label: namespace,
        type: "database",
      }))
    );

    this.edges = this.edges.concat(
      this.databasesUsages.map(({ componentId, databaseId, accessType }) => {
        const id = `db${databaseId}/${componentId}`;
        const source = componentId;
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
      })
    );
  }

  #syncCouplingDimension() {
    if (this.nodes.every((n) => n.type !== "operation")) {
      this.components.forEach((comp) => {
        comp.operations.forEach((op: any) => {
          if (
            this.syncOperations.find(
              ({ to, label }) => to === comp.id && label === op
            )
          ) {
            this.nodes.push({
              id: `op_${op}_from_${comp.id}`,
              label: op,
              type: "operation",
            });

            this.edges.push({
              id: `op${op}/${comp.id}`,
              source: comp.id,
              target: `op_${op}_from_${comp.id}`,
              type: "operation",
            });
          }
        });
      });
    }

    this.edges = this.edges.concat(
      this.syncOperations.map(({ from, to, label }: any) => ({
        id: `sync-op_${label}_from_${to}/${from}`,
        source: `op_${label}_from_${to}`,
        target: from,
        type: "sync",
        label,
      }))
    );
  }

  #syncCouplingDimensionWithoutOperations() {
    this.edges = this.edges.concat(
      this.syncOperations
        .reduce(
          (acc, op) =>
            acc.find(({ from, to }: any) => op.from === from && op.to === to)
              ? acc
              : [...acc, op],
          []
        )
        .map(({ from, to, label }: any) => ({
          id: `sync-${to}/${from}`,
          source: to,
          target: from,
          type: "sync",
          label,
        }))
    );
  }

  #asyncCouplingDimension() {
    this.edges = this.edges.concat(
      this.asyncOperations.map(({ from, to, label }: any) => ({
        id: `async-${from}/${to}`,
        source: from,
        target: to,
        type: "async",
        label,
      }))
    );
  }

  #addNeighborsToNodes() {
    this.edges.forEach((link) => {
      const a = this.nodes.find((n) => n.id === link.source);
      const b = this.nodes.find((n) => n.id === link.target);
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
  }

  static #build(
    system: any,
    dimensions: any,
    componentType = "service",
    options: any = {}
  ) {
    const processor = new GraphDataProcessor(system, componentType);
    const buildOptions = {
      [Dimension.SIZE]() {
        processor.#sizeDimension();
      },
      [Dimension.DATA_COUPLING]() {
        processor.#dataCouplingDimension();
      },
      [Dimension.SYNC_COUPLING]() {
        options.showOperations
          ? processor.#syncCouplingDimension()
          : processor.#syncCouplingDimensionWithoutOperations();
      },
      [Dimension.ASYNC_COUPLING]() {
        processor.#asyncCouplingDimension();
      },
    };

    dimensions.forEach((dimension: any) => buildOptions[dimension]());

    curveOverlappingLinks(processor.edges);
    processor.#addNeighborsToNodes();

    return {
      nodes: processor.nodes,
      links: processor.edges.map((edge) => ({
        ...edge,
        dashed: edge.type === "async",
      })),
    };
  }

  static buildForServices(system: any, dimensions: any, options = {}) {
    return GraphDataProcessor.#build(system, dimensions, "service", options);
  }

  static buildForModules(system: any, dimensions: any, options = {}) {
    return GraphDataProcessor.#build(system, dimensions, "module", options);
  }
}
