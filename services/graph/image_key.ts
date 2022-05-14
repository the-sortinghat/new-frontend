import cytoscape from "cytoscape";

type Payload = {
  container: HTMLElement;
};

export default function ImageKeyGenerator({ container }: Payload) {
  cytoscape({
    container,
    minZoom: 2,
    maxZoom: 2,
    autoungrabify: true,
    autounselectify: true,
    boxSelectionEnabled: false,
    userPanningEnabled: false,
    panningEnabled: false,
    elements: {
      nodes: [
        { data: { type: "ellipse", label: "Service" } },
        { data: { type: "rectangle", label: "Module" } },
        { data: { type: "hexagon", label: "Database" } },
        { data: { id: "n01", label: "", type: "ellipse" } },
        { data: { id: "n02", label: "", type: "ellipse" } },
        { data: { id: "n03", label: "", type: "ellipse" } },
        { data: { id: "n04", label: "", type: "ellipse" } },
        { data: { id: "n05", label: "", type: "ellipse" } },
        { data: { id: "n06", label: "", type: "hexagon" } },
      ],
      edges: [
        {
          data: {
            id: "n01n02",
            source: "n01",
            target: "n02",
            type: "sync",
            caption: "Synchronous call",
          },
        },
        {
          data: {
            id: "n03n04",
            source: "n03",
            target: "n04",
            type: "async",
            caption: "Asynchronous call",
          },
        },
        {
          data: {
            id: "n05n06",
            source: "n05",
            target: "n06",
            label: "R/W",
            type: "db",
            caption: "Database usage",
          },
        },
      ],
    },
    style: [
      {
        selector: "node",
        style: {
          shape:
            "data(type)" as cytoscape.Css.PropertyValueNode<cytoscape.Css.NodeShape>,
          label: "data(label)",
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
    ],
    layout: {
      name: "grid",
    },
  });
}
