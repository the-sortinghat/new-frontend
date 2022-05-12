import React from "react";
import Cytoscape, { ElementDefinition } from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import CytoscapeComponent from "react-cytoscapejs";
import { System } from "../../types/system";
import GraphProcessor from "../../services/graph_processor";
import { Dimension, Dimensions } from "../../types/dimensions";

Cytoscape.use(COSEBilkent);

const processGraphData = (
  system: System,
  dimensions: Dimensions
): Cytoscape.ElementDefinition[] => {
  let processor = new GraphProcessor(system);
  const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;
  const buildOptions = {
    [SIZE]() {
      processor = processor.sizeDimension();
    },
    [DATA_COUPLING]() {
      processor = processor.dataCouplingDimension();
    },
    [SYNC_COUPLING]() {
      processor = processor.syncCouplingDimension();
    },
    [ASYNC_COUPLING]() {
      processor = processor.asyncCouplingDimension();
    },
  };

  dimensions.forEach((dimension) => buildOptions[dimension]());

  const graph = processor.build();

  return CytoscapeComponent.normalizeElements({
    nodes: graph.nodes.map((node) => ({
      data: node as unknown as ElementDefinition,
    })),
    edges: graph.edges.map((edge) => ({
      data: edge as unknown as ElementDefinition,
    })),
  });
};

const Graph: React.FC<{ system: System; dimensions: Dimensions }> = ({
  system,
  dimensions,
}) => {
  const elements = processGraphData(system, dimensions);
  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "100%", height: "100%" }}
      stylesheet={[
        {
          selector: "node",
          style: {
            content: "data(label)",
            width: 15,
            height: 15,
            "font-size": 7,
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
          selector: ":parent",
          style: {
            label: "",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.5,
          },
        },
        {
          selector: "edge[type = 'sync']",
          style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
          },
        },
        {
          selector: "edge[type = 'async']",
          style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "line-style": "dashed",
          },
        },
        {
          selector: "edge[type = 'db']",
          style: {
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 5,
          },
        },
      ]}
      layout={{
        name: "cose-bilkent",
        ready: (e) => {
          e.cy.removeData("*");
          e.cy.add(elements);
        },
      }}
      minZoom={0.5}
      maxZoom={2}
      boxSelectionEnabled={false}
      autounselectify={true}
    />
  );
};

export default Graph;
