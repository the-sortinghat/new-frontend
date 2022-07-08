import CytoscapeComponent from "react-cytoscapejs";
import styles from "@/components/ImageKey/styles.module.css";
import imageKeyModel from "@/components/ImageKey/model";

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
