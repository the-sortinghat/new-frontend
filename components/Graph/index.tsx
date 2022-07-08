import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Dimension, System } from "@/types/system";
import { Core } from "cytoscape";
import graphModel from "@/components/Graph/model";
import styles from "@/components/Graph/styles.module.css";

type Props = {
  system: System;
  dimensions: Dimension[];
  setSelection: (_: any) => void;
};

type SetupGraphInteractionParams = {
  cyRef: Core | undefined;
  setSelection: (_: any) => void;
};

const setupGraphInteraction = ({
  cyRef,
  setSelection,
}: SetupGraphInteractionParams) => {
  cyRef?.on("click", "node", (e) => {
    graphModel.handleClick(cyRef!, e, setSelection);
  });
  cyRef?.on("mouseover", "edge[type!='db']", (e) => {
    const edge = e.target;
    if (!edge.hasClass("semitransp")) edge.style("label", edge.data().label);
  });
  cyRef?.on("mouseout", "edge", (e) => {
    const edge = e.target;
    edge.style("label", "");
  });
};

const handleDimensionsChanges = (cyRef: Core | undefined) => {
  cyRef
    ?.elements()
    .filter((elem) => elem.hasClass("clicked"))
    .forEach((node) => {
      graphModel.defocusNodes(cyRef!, node);
      graphModel.deselectGraphNode(cyRef!, node);
      graphModel.selectGraphNode(cyRef!, node);
    });
};

const Graph = ({ system, dimensions, setSelection }: Props) => {
  const [zoom, setZoom] = useState(0.5);
  let cyRef: Core | undefined = undefined;

  useEffect(
    () => setupGraphInteraction({ cyRef, setSelection }),
    [cyRef, setSelection]
  );
  useEffect(() => handleDimensionsChanges(cyRef), [cyRef, dimensions]);

  const zoomIn = () => setZoom(zoom + 0.5);

  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.5);
    }
  };

  return (
    <div className={styles.graphContainer}>
      <CytoscapeComponent
        className={styles.graph}
        cy={(cy) => (cyRef = cy)}
        minZoom={zoom}
        userZoomingEnabled={false}
        boxSelectionEnabled={false}
        autounselectify={true}
        elements={graphModel.getElements(system, dimensions)}
        layout={graphModel.makeLayout()}
        stylesheet={graphModel.stylesheet}
      />
      <div className={styles.graphZoomOptions}>
        <button type="button" onClick={zoomIn}>
          +
        </button>
        <button type="button" onClick={zoomOut}>
          -
        </button>
      </div>
    </div>
  );
};

export default Graph;
