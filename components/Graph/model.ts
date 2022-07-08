import {
  Core,
  EdgeDefinition,
  ElementDefinition,
  EventObject,
  NodeDefinition,
} from "cytoscape";
import GraphDataProcessor from "@/services/graph_data_processor";
import { makeLayout, stylesheet } from "@/components/Graph/graph_styles";
import { Dimension, System } from "@/types/system";

function getElements(
  system: System,
  dimensions: Dimension[]
): ElementDefinition[] {
  const graph = GraphDataProcessor.build(system, dimensions);
  return [
    ...graph.nodes.map((node) => ({
      data: node as unknown as NodeDefinition,
    })),
    ...(graph.edges.map((edge) => ({
      data: edge as unknown,
    })) as EdgeDefinition[]),
  ];
}

function handleClick(cy: Core, e: EventObject, setSelection: (_: any) => void) {
  const node = e.target;

  if (node.data().type === "module") {
    if (node.hasClass("clicked")) {
      deselectGraphNode(cy, node);
    } else {
      cy.elements()
        .filter((elem) => elem.hasClass("clicked"))
        .forEach((elem) => deselectGraphNode(cy, elem));

      selectGraphNode(cy, node);
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
      ? deselectGraphNode(cy, node)
      : selectGraphNode(cy, node);
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
}

function selectGraphNode(cy: Core, n: any) {
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
      .filter((elem) => elem.hasClass("clicked") || elem.hasClass("highlight"))
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
}

function deselectGraphNode(cy: Core, n: any) {
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
}

function defocusNodes(cy: Core, n: any) {
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
}

const graphModel = {
  getElements,
  makeLayout,
  stylesheet,
  handleClick,
  selectGraphNode,
  deselectGraphNode,
  defocusNodes,
};

export default graphModel;
