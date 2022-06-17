import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";
import GraphDataProcessor from "@/services/graph/data_processor";
import { Core, EdgeDefinition, EventObject, NodeDefinition } from "cytoscape";

type Props = {
  system: System;
  dimensions: Dimensions;
  setSelection: (_: any) => void;
};

const defocusNodes = (cy: Core, n: any) => {
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
};

const deselectGraphNode = (cy: Core, n: any) => {
  if (n.data().type === "service") {
    cy.elements().removeClass("semitransp");
    n.removeClass("highlight")
      .removeClass("clicked")
      .outgoers()
      .removeClass("highlight");
    n.incomers().removeClass("highlight");
  } else {
    cy.elements().removeClass("semitransp");
    n.removeClass("clicked");
    n.children().outgoers().ancestors().removeClass("highlight");
    n.children().incomers().ancestors().removeClass("highlight");
  }
};

const selectGraphNode = (cy: Core, n: any) => {
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

    n.addClass("highlight")
      .addClass("clicked")
      .outgoers()
      .addClass("highlight");
    n.incomers().addClass("highlight");

    parents.forEach((element: any) => {
      element.removeClass("semitransp");
    });
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
};

const graphClickInteraction = (
  cy: Core,
  e: EventObject,
  setSelection: (_: any) => void
) => {
  const node = e.target;
  const clicked = cy.elements().filter((elem) => elem.hasClass("clicked"));

  if (clicked.size() === 1 && clicked.first().id() !== node.id()) {
    deselectGraphNode(cy, clicked.first());
    selectGraphNode(cy, node);
    setSelection({ type: node.data().type, name: node.data().label });
  } else if (node.hasClass("clicked")) {
    deselectGraphNode(cy, node);
    setSelection({ type: "", name: "" });
  } else {
    selectGraphNode(cy, node);
    setSelection({ type: node.data().type, name: node.data().label });
  }
};

const Graph: React.FC<Props> = ({ system, dimensions, setSelection }) => {
  const [zoom, setZoom] = useState(0.5);
  const graph = GraphDataProcessor.build(system, dimensions);
  let cyRef: Core | undefined = undefined;

  useEffect(() => {
    if (cyRef) {
      cyRef.on("click", "node", (e) => {
        graphClickInteraction(cyRef!, e, setSelection);
      });
    }
  }, [cyRef, setSelection]);

  useEffect(() => {
    if (!cyRef) return;

    const clicked = cyRef.elements().filter((elem) => elem.hasClass("clicked"));

    if (clicked.size() !== 1) return;

    const node = clicked.first() as any;

    defocusNodes(cyRef, node);
    deselectGraphNode(cyRef, node);
    selectGraphNode(cyRef, node);
  }, [cyRef, dimensions]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        border: "1px solid #ccc",
      }}
    >
      <CytoscapeComponent
        style={{ width: "100%", height: "100%" }}
        cy={(cy) => {
          cyRef = cy;
        }}
        minZoom={zoom}
        userZoomingEnabled={false}
        boxSelectionEnabled={false}
        autounselectify={true}
        elements={[
          ...graph.nodes.map((node) => ({
            data: node as unknown as NodeDefinition,
          })),
          ...(graph.edges.map((edge) => ({
            data: edge as unknown,
          })) as EdgeDefinition[]),
        ]}
        layout={{
          name: "grid",
          avoidOverlap: true,
          ready: (_) => {},
          stop: (_) => {},
        }}
        stylesheet={[
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
        ]}
      />
      <div
        className="graphZoomOptions"
        style={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "end",
        }}
      >
        <button type="button" onClick={() => setZoom(zoom + 0.5)}>
          +
        </button>
        <button
          type="button"
          onClick={() => {
            if (zoom > 0.5) setZoom(zoom - 0.5);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Graph;
