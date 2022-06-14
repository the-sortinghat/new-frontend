import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";
import cytoscape, { EdgeDefinition, NodeDefinition } from "cytoscape";
import GraphDataProcessor from "@/services/graph/data_processor";

type Payload = {
  system: System;
  dimensions: Dimensions;
  container: HTMLElement;
  options: { [key: string]: any };
};

export default function GraphGenerator({
  system,
  dimensions,
  container,
  options,
}: Payload) {
  const graph = GraphDataProcessor.build(system, dimensions);
  const { setSelectedService } = options;

  const cy = cytoscape({
    container,
    minZoom: options.zoom,
    boxSelectionEnabled: false,
    autounselectify: true,
    style: [
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
          backgroundColor: "red",
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
          "font-size": 5,
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
    ],
    elements: {
      nodes: graph.nodes.map((node) => ({
        data: node as unknown as NodeDefinition,
      })),
      edges: graph.edges.map((edge) => ({
        data: edge as unknown,
      })) as EdgeDefinition[],
    },
    layout: {
      name: "grid",
      avoidOverlap: true,
    },
  });

  cy.on("click", "node", function (e) {
    const node = e.target;

    if (node.data().type === "module") return;

    const deselect = function (n: any) {
      cy.elements().removeClass("semitransp");
      n.removeClass("highlight")
        .removeClass("clicked")
        .outgoers()
        .removeClass("highlight");
      n.incomers().removeClass("highlight");
    };

    const select = function (n: any) {
      const parents = n
        .ancestors()
        .toArray()
        .concat(n.outgoers().ancestors().toArray())
        .concat(n.incomers().ancestors().toArray());

      cy.elements()
        .difference(n.outgoers())
        .difference(n.incomers())
        .not(n)
        .addClass("semitransp");

      n.addClass("highlight")
        .addClass("clicked")
        .outgoers()
        .addClass("highlight");
      n.incomers().addClass("highlight");

      parents.forEach((element: any) => {
        element.removeClass("semitransp");
      });
    };

    const clicked = cy.elements().filter((elem) => elem.hasClass("clicked"));

    if (clicked.size() === 1 && clicked.first() !== node) {
      deselect(clicked.first());
      select(node);

      if (node.data().type === "service") setSelectedService(node.data().label);
    } else if (node.hasClass("highlight")) {
      deselect(node);
      setSelectedService("");
    } else {
      select(node);
      if (node.data().type === "service") setSelectedService(node.data().label);
    }
  });
}
