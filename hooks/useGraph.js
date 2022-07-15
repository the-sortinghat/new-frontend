import ForceGraph from "force-graph";
import { useEffect, useRef } from "react";
import GraphDataProcessor from "../services/graph_data_processor";

export const curveOverlappingLinks = (links) => {
  const selfLoopLinks = {};
  const sameNodesLinks = {};
  const curvatureMinMax = 0.5;

  // 1. assign each link a nodePairId that combines their source and target independent of the links direction
  // 2. group links together that share the same two nodes or are self-loops
  links.forEach((link) => {
    link.nodePairId =
      link.source <= link.target
        ? link.source + "_" + link.target
        : link.target + "_" + link.source;
    const map = link.source === link.target ? selfLoopLinks : sameNodesLinks;
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

export const calculateNeighborsByDepth = (node, depth) => {
  const allNeighbors = [];
  const allLinks = [];
  const queue = [];
  const visited = new Set();

  queue.push([node, 0]);

  while (queue.length > 0) {
    const [currNode, level] = queue.shift();

    if (level === depth) continue;
    if (!currNode.neighbors) continue;

    for (let i = 0; i < currNode.neighbors.length; i++) {
      const neighbor = currNode.neighbors[i];
      allLinks.push(
        currNode.links.find(
          (link) => link.target === neighbor.id || link.source === neighbor.id
        )
      );

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        allNeighbors.push(neighbor);
        queue.push([neighbor, level + 1]);
      }
    }
  }

  return { allNeighbors, allLinks };
};

const useGraph = ({ system, dimensions, depth, selected, onSelection }) => {
  const graphRef = useRef();

  useEffect(() => {
    const width = graphRef.current.clientWidth;
    const height = graphRef.current.clientHeight;
    const myGraph = ForceGraph()(graphRef.current).width(width).height(height);

    const highlightNodes = new Set();
    const highlightLinks = new Set();

    const filterGraphAroundSelectedNode = () => {
      const node = myGraph
        .graphData()
        .nodes.find((n) => n.id === selected[0].id);

      const { allNeighbors, allLinks } = calculateNeighborsByDepth(node, depth);
      node.neighbors = [...allNeighbors];
      node.links = [...allLinks];

      highlightNodes.add(node);
      node?.neighbors?.forEach((neighbor) => highlightNodes.add(neighbor));
      node?.links?.forEach((link) => highlightLinks.add(link));

      myGraph.zoom(5, 1000);

      myGraph.graphData({
        nodes: [...highlightNodes],
        links: [...highlightLinks],
      });
    };

    const handleNodeClick = (node) => {
      if (selected.find((n) => n.id === node.id)) {
        onSelection([]);
        return;
      }

      if (node) {
        onSelection([{ id: node.id, type: "service", name: node.label }]);
      }
    };

    const drawService = (node, ctx) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3 * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = selected.find((n) => n.id === node.id)
        ? "orange"
        : highlightNodes.has(node)
        ? "#6b46c1"
        : "#CCC";
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.font = `3px 'Montserrat'`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + 9);
    };

    const drawDatabase = (node, ctx) => {
      const img = new Image();
      img.src = "/assets/database.svg";
      const size = 8;
      ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
      ctx.fillStyle = "black";
      ctx.font = `3px 'Montserrat'`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + 10);
    };

    const drawOperation = (node, ctx) => {
      ctx.beginPath();
      const width = 5;
      const height = 5;
      ctx.moveTo(node.x, node.y);
      // top left edge
      ctx.lineTo(node.x - width / 2, node.y + height / 2);

      // bottom left edge
      ctx.lineTo(node.x, node.y + height);

      // bottom right edge
      ctx.lineTo(node.x + width / 2, node.y + height / 2);
      ctx.fillStyle = highlightNodes.has(node) ? "#6b46c1" : "blue";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = `3px 'Montserrat'`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + 6);
    };

    const { nodes, edges } = GraphDataProcessor.build(system, dimensions);

    curveOverlappingLinks(edges);
    const initialData = {
      nodes: nodes.filter((node) => node.type !== "module"),
      links: edges.map((edge) => ({
        ...edge,
        dashed: edge.type === "async",
      })),
    };

    initialData.links.forEach((link) => {
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

    myGraph.graphData(initialData);

    selected.length > 0 && filterGraphAroundSelectedNode();

    myGraph
      .onNodeClick(handleNodeClick)
      .autoPauseRedraw(false) // keep redrawing after engine has stopped
      .linkWidth((link) => (highlightLinks.has(link) ? 5 : 1))
      .linkDirectionalParticles(4)
      .linkDirectionalParticleWidth((link) =>
        highlightLinks.has(link) ? 4 : 0
      )
      .nodeCanvasObject((node, ctx) => {
        const drawByType = {
          database: () => drawDatabase(node, ctx),
          operation: () => drawOperation(node, ctx),
          service: () => drawService(node, ctx),
        };

        drawByType[node.type]();
      })
      .onNodeDragEnd((node) => {
        if (node.type !== "service") return;
        node.fx = node.x;
        node.fy = node.y;
      })
      .linkCurvature("curvature")
      .linkDirectionalArrowLength(6)
      .linkWidth(3)
      .linkDirectionalArrowRelPos(1)
      .linkLineDash((link) => link.dashed && [3, 3])
      .zoom(3);
  }, [depth, dimensions, onSelection, selected, system]);

  return graphRef;
};

export default useGraph;
