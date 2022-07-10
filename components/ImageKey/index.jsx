import CytoscapeComponent from "react-cytoscapejs";
import imageKeyModel from "./model";
import styles from "./styles.module.css";

const ImageKey = () => {
  return (
    <>
      <h2>Image key</h2>
      <div className={styles.imageKeyContainer}>
        <CytoscapeComponent
          className={styles.imageKey}
          minZoom={2}
          maxZoom={2}
          autoungrabify={true}
          autounselectify={true}
          boxSelectionEnabled={false}
          userPanningEnabled={false}
          panningEnabled={false}
          elements={imageKeyModel.getElements()}
          layout={imageKeyModel.makeLayout()}
          stylesheet={imageKeyModel.stylesheet}
        />
      </div>
    </>
  );
};

export default ImageKey;
