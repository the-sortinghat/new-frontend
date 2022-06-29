import GraphDataProcessor from "@/services/graph/data_processor";
import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";
import cytoscape, {
  Core,
  EdgeDefinition,
  EventObject,
  NodeDefinition,
} from "cytoscape";

const graphModel = {
  elements(
    system: System,
    dimensions: Dimensions
  ): cytoscape.ElementDefinition[] {
    const graph = GraphDataProcessor.build(system, dimensions);
    return [
      ...graph.nodes.map((node) => ({
        data: node as unknown as NodeDefinition,
      })),
      ...(graph.edges.map((edge) => ({
        data: edge as unknown,
      })) as EdgeDefinition[]),
    ];
  },
  stylesheet: [
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
  ] as cytoscape.Stylesheet[],
  click(cy: Core, e: EventObject, setSelection: (_: any) => void) {
    const node = e.target;

    if (node.data().type === "module") {
      if (node.hasClass("clicked")) {
        graphModel.deselectGraphNode(cy, node);
      } else {
        cy.elements()
          .filter((elem) => elem.hasClass("clicked"))
          .forEach((elem) => graphModel.deselectGraphNode(cy, elem));

        graphModel.selectGraphNode(cy, node);
      }
    } else {
      const hasModuleSelected =
        cy
          .elements()
          .filter(
            (elem) => elem.hasClass("clicked") && elem.data().type === "module"
          )
          .size() > 0;
      if (hasModuleSelected) {
        cy.elements()
          .removeClass("highlight")
          .removeClass("clicked")
          .removeClass("semitransp");
      }

      node.hasClass("clicked")
        ? graphModel.deselectGraphNode(cy, node)
        : graphModel.selectGraphNode(cy, node);
    }

    setSelection(
      cy
        .elements()
        .filter((elem) => elem.hasClass("clicked"))
        .reduce(
          (acc, elem) => [
            ...acc,
            { type: elem.data().type, name: elem.data().label },
          ],
          [] as { type: string; name: string }[]
        )
    );
  },
  selectGraphNode(cy: Core, n: any) {
    if (n.data().type === "service") {
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

      n.addClass("clicked");
      n.outgoers().addClass("highlight");
      n.incomers().addClass("highlight");

      parents.forEach((element: any) => {
        element.removeClass("semitransp");
      });

      // remove semi transparency from nodes already selected / highlighted
      cy.elements()
        .filter(
          (elem) => elem.hasClass("clicked") || elem.hasClass("highlight")
        )
        .removeClass("semitransp")
        .ancestors()
        .removeClass("semitransp");
    } else {
      cy.elements()
        .difference(n.children().outgoers())
        .difference(n.children().incomers())
        .difference(n.children().outgoers().ancestors())
        .difference(n.children().incomers().ancestors())
        .not(n)
        .not(n.children())
        .addClass("semitransp");

      n.addClass("clicked");
      n.children().outgoers().ancestors().addClass("highlight");
      n.children().incomers().ancestors().addClass("highlight");
    }
  },
  deselectGraphNode(cy: Core, n: any) {
    if (n.data().type === "service") {
      cy.elements().removeClass("highlight").removeClass("semitransp");
      n.removeClass("clicked");

      const clickedElems = cy
        .elements()
        .filter((elem) => elem.hasClass("clicked"));

      if (clickedElems.size() === 0) {
        cy.elements().removeClass("semitransp");
        return;
      }

      clickedElems.outgoers().addClass("highlight");
      clickedElems.incomers().addClass("highlight");

      const parents = clickedElems
        .ancestors()
        .toArray()
        .concat(clickedElems.outgoers().ancestors().toArray())
        .concat(clickedElems.incomers().ancestors().toArray());

      cy.elements()
        .filter(
          (elem) => !elem.hasClass("clicked") && !elem.hasClass("highlight")
        )
        .addClass("semitransp");

      parents.forEach((element: any) => {
        element.removeClass("semitransp");
      });
    } else {
      cy.elements().removeClass("semitransp");
      n.removeClass("clicked");
      n.children().outgoers().ancestors().removeClass("highlight");
      n.children().incomers().ancestors().removeClass("highlight");
    }
  },
  defocusNodes(cy: Core, n: any) {
    if (n.data().type === "service") {
      cy.elements()
        .not(n)
        .not(n.ancestors())
        .not(n.outgoers())
        .not(n.incomers())
        .removeClass("highlight")
        .addClass("semitransp");
    } else {
      cy.elements()
        .not(n)
        .not(n.children().outgoers().ancestors())
        .not(n.children().incomers().ancestors())
        .removeClass("highlight")
        .addClass("semitransp");
    }
  },
};

export default graphModel;
