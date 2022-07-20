import { DatabaseAccessType, Dimension } from "../common";
import { curveOverlappingLinks } from "./graph_utils";

export default class GraphDataProcessor {
  constructor(system) {
    this.system = system;
    this.nodes = [];
    this.edges = [];

    this.nodes = this.nodes.concat(
      system.services.map(({ id, name, operations }) => ({
        id: `s${id}`,
        label: name,
        type: "service",
        operations,
      }))
    );
  }

  #sizeDimension() {
    this.system.services
      .reduce(
        (acc, { id, operations }) => [...acc, { serviceId: id, operations }],
        []
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

  #dataCouplingDimension() {
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

  #syncCouplingDimension() {
    if (this.nodes.every((n) => n.type !== "operation")) {
      this.system.services.forEach((s) => {
        s.operations.forEach((op) => {
          if (
            this.system.syncOperations.find(
              ({ to, label }) => to === s.id && label === op
            )
          ) {
            this.nodes.push({
              id: `op_${op}_from_s${s.id}`,
              label: op,
              type: "operation",
            });

            this.edges.push({
              id: `op${op}/s${s.id}`,
              source: `s${s.id}`,
              target: `op_${op}_from_s${s.id}`,
              type: "operation",
            });
          }
        });
      });
    }

    this.edges = this.edges.concat(
      this.system.syncOperations.map(({ from, to, label }) => ({
        id: `sync-op_${label}_from_s${to}/s${from}`,
        source: `op_${label}_from_s${to}`,
        target: `s${from}`,
        type: "sync",
        label,
      }))
    );
  }

  #asyncCouplingDimension() {
    this.edges = this.edges.concat(
      this.system.asyncOperations.map(({ from, to, label }) => ({
        id: `async-s${from}/s${to}`,
        source: `s${from}`,
        target: `s${to}`,
        type: "async",
        label,
      }))
    );
  }

  static build(system, dimensions) {
    const processor = new GraphDataProcessor(system);
    const buildOptions = {
      [Dimension.SIZE]() {
        processor.#sizeDimension();
      },
      [Dimension.DATA_COUPLING]() {
        processor.#dataCouplingDimension();
      },
      [Dimension.SYNC_COUPLING]() {
        processor.#syncCouplingDimension();
      },
      [Dimension.ASYNC_COUPLING]() {
        processor.#asyncCouplingDimension();
      },
    };

    dimensions.forEach((dimension) => buildOptions[dimension]());

    curveOverlappingLinks(processor.edges);

    processor.edges.forEach((link) => {
      const a = processor.nodes.find((n) => n.id === link.source);
      const b = processor.nodes.find((n) => n.id === link.target);
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });

    return {
      nodes: processor.nodes,
      links: processor.edges.map((edge) => ({
        ...edge,
        dashed: edge.type === "async",
      })),
    };
  }

  static buildForModules(system, dimensions) {
    const setOfDimensions = new Set(dimensions);
    const serviceToModuleMap = {};

    system.services.find((s) => {
      serviceToModuleMap[s.id] = system.modules.find(
        (mod) => mod.id === s.moduleId
      );
    });

    let nodes = [];
    let edges = [];

    nodes = system.modules.map(({ id, name }) => ({
      id: `m${id}`,
      label: name,
      type: "module",
    }));

    if (setOfDimensions.has(Dimension.SIZE)) {
      system.services.forEach((s) => {
        s.operations.forEach((op) => {
          nodes.push({
            id: `op_${op}_from_m${serviceToModuleMap[s.id].id}`,
            label: op,
            type: "operation",
          });

          edges.push({
            id: `op${op}/m${serviceToModuleMap[s.id].id}`,
            source: `m${serviceToModuleMap[s.id].id}`,
            target: `op_${op}_from_m${serviceToModuleMap[s.id].id}`,
            type: "operation",
          });
        });
      });
    }

    if (setOfDimensions.has(Dimension.DATA_COUPLING)) {
      nodes = nodes.concat(
        system.databasesUsages.map(({ databaseId, namespace }) => ({
          id: `db${databaseId}`,
          label: namespace,
          type: "database",
        }))
      );

      edges = edges.concat(
        system.databasesUsages.map(({ serviceId, databaseId, accessType }) => {
          const moduleId = serviceToModuleMap[serviceId].id;
          const id = `db${databaseId}/m${moduleId}`;
          const source = `m${moduleId}`;
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

    if (setOfDimensions.has(Dimension.SYNC_COUPLING)) {
      if (nodes.every((n) => n.type !== "operation")) {
        system.services.forEach((s) => {
          s.operations.forEach((op) => {
            if (
              system.syncOperations.find(
                ({ to, label }) => to === s.id && label === op
              )
            ) {
              nodes.push({
                id: `op_${op}_from_m${serviceToModuleMap[s.id].id}`,
                label: op,
                type: "operation",
              });

              edges.push({
                id: `op${op}/m${serviceToModuleMap[s.id].id}`,
                source: `m${serviceToModuleMap[s.id].id}`,
                target: `op_${op}_from_m${serviceToModuleMap[s.id].id}`,
                type: "operation",
              });
            }
          });
        });
      }

      edges = edges.concat(
        system.syncOperations.map(({ from, to, label }) => ({
          id: `sync-op_${label}_from_m${serviceToModuleMap[to].id}/m${serviceToModuleMap[from].id}`,
          source: `op_${label}_from_m${serviceToModuleMap[to].id}`,
          target: `m${serviceToModuleMap[from].id}`,
          type: "sync",
          label,
        }))
      );
    }

    if (setOfDimensions.has(Dimension.ASYNC_COUPLING)) {
      edges = edges.concat(
        system.asyncOperations.map(({ from, to, label }) => ({
          id: `async-m${serviceToModuleMap[from].id}/m${serviceToModuleMap[to].id}`,
          source: `m${serviceToModuleMap[from].id}`,
          target: `m${serviceToModuleMap[to].id}`,
          type: "async",
          label,
        }))
      );
    }

    curveOverlappingLinks(edges);

    edges.forEach((link) => {
      const a = nodes.find((n) => n.id === link.source);
      const b = nodes.find((n) => n.id === link.target);
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });

    return {
      nodes,
      links: edges.map((edge) => ({
        ...edge,
        dashed: edge.type === "async",
      })),
    };
  }
}
