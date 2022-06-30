import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";
import { Core } from "cytoscape";
import graphModel from "@/components/Graph/model";

type Props = {
  system: System;
  dimensions: Dimensions;
  setSelection: (_: any) => void;
};

const Graph: React.FC<Props> = ({ system, dimensions, setSelection }) => {
  const [zoom, setZoom] = useState(0.5);
  let cyRef: Core | undefined = undefined;

  useEffect(() => {
    if (cyRef) {
      cyRef.on("click", "node", (e) => {
        graphModel.click(cyRef!, e, setSelection);
      });
      cyRef.on("mouseover", "edge[type!='db']", (e) => {
        const edge = e.target;

        if (!edge.hasClass("semitransp"))
          edge.style("label", edge.data().label);
      });
      cyRef.on("mouseout", "edge", (e) => {
        const edge = e.target;
        edge.style("label", "");
      });
    }
  }, [cyRef, setSelection]);

  useEffect(() => {
    if (!cyRef) return;

    cyRef
      .elements()
      .filter((elem) => elem.hasClass("clicked"))
      .forEach((node) => {
        graphModel.defocusNodes(cyRef!, node);
        graphModel.deselectGraphNode(cyRef!, node);
        graphModel.selectGraphNode(cyRef!, node);
      });
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
        elements={graphModel.elements(system, dimensions)}
        layout={{
          name: "grid",
          avoidOverlap: true,
          ready: (_: any) => {},
          stop: (_: any) => {},
        }}
        stylesheet={graphModel.stylesheet}
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
            if (zoom > 0.5) {
              setZoom(zoom - 0.5);
            }
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Graph;
