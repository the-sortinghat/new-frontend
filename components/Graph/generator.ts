import { Node, Edge, Network, Options } from "vis-network";

export default function GraphGenerator(payload: any) {
  const { data, container } = payload;

  const nodes: Node[] = data.nodes;

  const edges: Edge[] = data.edges.map((edge: any) => ({
    ...edge,
    arrows: "to",
    dashes: edge.type === "async",
    color: { color: "black" },
  }));

  const options: Options = {
    nodes: {
      shape: "dot",
      size: 12,
      color: "#6b46c1",
      font: {
        size: 12,
        color: "#000000",
      },
      borderWidth: 2,
    },
  };

  new Network(container, { nodes, edges }, options);
}
