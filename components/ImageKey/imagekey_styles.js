export const makeLayout = () => ({
  name: "grid",
  stop: () => {},
});

export const stylesheet = [
  {
    selector: "node",
    style: {
      shape: "data(type)",
      label: "data(label)",
      backgroundColor: "data(color)",
      height: 18,
      width: 18,
      "font-size": 12,
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 10,
    },
  },
  {
    selector: "node[type='rectangle']",
    style: {
      width: 30,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      label: "data(caption)",
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "arrow-scale": 1,
      "font-size": 12,
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 20,
    },
  },
  {
    selector: "edge[type = 'async']",
    style: {
      "line-style": "dashed",
    },
  },
  {
    selector: "edge[type = 'operation']",
    style: {
      "target-arrow-shape": "none",
    },
  },
];
