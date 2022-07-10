import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import graphModel from "./model";
import styles from "./styles.module.css";

cytoscape.use(COSEBilkent);

const setupGraphInteraction = ({ cyRef, setSelection }) => {
  cyRef?.on("click", "node", (e) => {
    if (e.target.data().type !== "service" && e.target.data().type !== "module")
      return;

    graphModel.handleClick(cyRef, e, setSelection);
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

const handleDimensionsChanges = (cyRef) => {
  cyRef
    ?.elements()
    .filter((elem) => elem.hasClass("clicked"))
    .forEach((node) => {
      graphModel.defocusNodes(cyRef, node);
      graphModel.deselectGraphNode(cyRef, node);
      graphModel.selectGraphNode(cyRef, node);
    });
};

const Graph = ({ system, dimensions, setSelection }) => {
  const [zoom, setZoom] = useState(0.5);
  let cyRef = undefined;

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
