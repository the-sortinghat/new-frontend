import cytoscape, { EdgeDefinition, NodeDefinition } from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import { Dimension, Dimensions } from "../../types/dimensions";
import { Graph } from "../../types/graph";
import { System } from "../../types/system";
import GraphProcessor from "../graph_processor";

const processGraphData = (system: System, dimensions: Dimensions): Graph => {
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

  return processor.build();
};

export default function GraphGenerator(system: System, dimensions: Dimensions) {
  const graph = processGraphData(system, dimensions);

  cytoscape.use(COSEBilkent);

  cytoscape({
    container: document.getElementById("graph"),
    minZoom: 0.5,
    maxZoom: 2,
    boxSelectionEnabled: false,
    autounselectify: true,
    style: [
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
      name: "cose-bilkent",
    },
  });
}
