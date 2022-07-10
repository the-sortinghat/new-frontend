export const makeLayout = () => ({
  name: "cose-bilkent",
  avoidOverlap: true,
  ready: () => {},
  stop: () => {},
  nodeRepulsion: 15000,
  idealEdgeLength: 100,
});

export const stylesheet = [
  {
    selector: "node",
    style: {
      content: "data(label)",
      width: 15,
      height: 15,
      "border-width": "1px",
      "border-color": "black",
      "font-size": 7,
      "font-weight": "bold",
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 2,
    },
  },
  {
    selector: "node[type = 'database']",
    style: {
      shape: "hexagon",
      backgroundColor: "green",
    },
  },
  {
    selector: "node[type = 'operation']",
    style: {
      shape: "diamond",
      backgroundColor: "blue",
    },
  },
  {
    selector: "node.highlight",
    style: {
      backgroundColor: "#6b46c1",
      opacity: 1,
    },
  },
  {
    selector: ":parent",
    style: {
      label: "",
      "border-width": "1px",
    },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "curve-style": "unbundled-bezier",
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.7,
      "font-size": 10,
    },
  },
  {
    selector: "edge[type = 'async']",
    style: {
      "line-style": "dashed",
    },
  },
  {
    selector: "edge[type = 'db']",
    style: {
      label: "data(label)",
    },
  },
  {
    selector: "edge[type = 'operation']",
    style: {
      "target-arrow-shape": "none",
    },
  },
  {
    selector: "node.semitransp",
    style: { opacity: 0.5 },
  },
  {
    selector: "node.clicked",
    style: {
      "background-color": "orange",
    },
  },
  {
    selector: "edge.highlight",
    style: {
      width: 2,
      "arrow-scale": 1,
    },
  },
  {
    selector: "edge.semitransp",
    style: { opacity: 0.2 },
  },
];
