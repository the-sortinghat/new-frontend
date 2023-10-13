import GraphDataProcessor from "@services/graph_data_processor";
import { Dimension } from "@common/dimension";

export const curveOverlappingLinks = (links: any[]) => {
  const selfLoopLinks: any = {};
  const sameNodesLinks: any = {};
  const curvatureMinMax = 0.5;

  // 1. assign each link a nodePairId that combines their source and target independent of the links direction
  // 2. group links together that share the same two nodes or are self-loops
  links.forEach((link) => {
    link.nodePairId =
      link.source <= link.target
        ? link.source + "_" + link.target
        : link.target + "_" + link.source;
    const map: any =
      link.source === link.target ? selfLoopLinks : sameNodesLinks;
    if (!map[link.nodePairId]) {
      map[link.nodePairId] = [];
    }
    map[link.nodePairId].push(link);
  });

  // Compute the curvature for self-loop links to avoid overlaps
  Object.keys(selfLoopLinks).forEach((id) => {
    const links = selfLoopLinks[id];
    const lastIndex = links.length - 1;
    links[lastIndex].curvature = 1;
    const delta = (1 - curvatureMinMax) / lastIndex;
    for (let i = 0; i < lastIndex; i++) {
      links[i].curvature = curvatureMinMax + i * delta;
    }
  });

  // Compute the curvature for links sharing the same two nodes to avoid overlaps
  Object.keys(sameNodesLinks)
    .filter((nodePairId) => sameNodesLinks[nodePairId].length > 1)
    .forEach((nodePairId) => {
      const links = sameNodesLinks[nodePairId];
      const lastIndex = links.length - 1;
      const lastLink = links[lastIndex];
      lastLink.curvature = curvatureMinMax;
      const delta = (2 * curvatureMinMax) / lastIndex;
      for (let i = 0; i < lastIndex; i++) {
        links[i].curvature = -curvatureMinMax + i * delta;
        if (lastLink.source !== links[i].source) {
          links[i].curvature *= -1; // flip it around, otherwise they overlap
        }
      }
    });
};

export const getAllCombinationsOfGraphData = (system: any) => {
  return [
    [],
    [Dimension.SIZE],
    [Dimension.DATA_COUPLING],
    [Dimension.SYNC_COUPLING],
    [Dimension.ASYNC_COUPLING],
    [Dimension.SIZE, Dimension.DATA_COUPLING],
    [Dimension.SIZE, Dimension.SYNC_COUPLING],
    [Dimension.SIZE, Dimension.ASYNC_COUPLING],
    [Dimension.DATA_COUPLING, Dimension.SYNC_COUPLING],
    [Dimension.DATA_COUPLING, Dimension.ASYNC_COUPLING],
    [Dimension.SYNC_COUPLING, Dimension.ASYNC_COUPLING],
    [Dimension.SIZE, Dimension.DATA_COUPLING, Dimension.SYNC_COUPLING],
    [Dimension.SIZE, Dimension.DATA_COUPLING, Dimension.ASYNC_COUPLING],
    [Dimension.SIZE, Dimension.SYNC_COUPLING, Dimension.ASYNC_COUPLING],
    [
      Dimension.DATA_COUPLING,
      Dimension.SYNC_COUPLING,
      Dimension.ASYNC_COUPLING,
    ],
    [
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
      Dimension.SYNC_COUPLING,
      Dimension.ASYNC_COUPLING,
    ],
  ].reduce(
    (acc, comb) => ({
      ...acc,
      [comb.join(",")]: {
        forServices: {
          withOperations: GraphDataProcessor.buildForServices(system, comb, {
            showOperations: true,
          }),
          withoutOperations: GraphDataProcessor.buildForServices(system, comb, {
            showOperations: false,
          }),
        },
        forModules: {
          withOperations: GraphDataProcessor.buildForModules(system, comb, {
            showOperations: true,
          }),
          withoutOperations: GraphDataProcessor.buildForModules(system, comb, {
            showOperations: false,
          }),
        },
      },
    }),
    {}
  );
};

export const calculateNeighborsByDepth = (node: any, depth: number) => {
  const allNeighbors = new Set();
  const allLinks = new Set();
  const queue: any[] = [];
  const visited = new Set();

  queue.push([node, 0]);

  while (queue.length > 0) {
    const [currNode, level] = queue.shift();

    if (level === depth) continue;
    if (!currNode.neighbors) continue;

    for (let i = 0; i < currNode.neighbors.length; i++) {
      const neighbor = currNode.neighbors[i];
      allLinks.add(
        currNode.links.find((link: any) => {
          const targetId =
            typeof link.target === "object" ? link.target.id : link.target;
          const sourceId =
            typeof link.source === "object" ? link.source.id : link.source;
          return targetId === neighbor.id || sourceId === neighbor.id;
        })
      );

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        allNeighbors.add(neighbor);
        queue.push([neighbor, level + 1]);
      }
    }
  }

  return { allNeighbors, allLinks };
};
