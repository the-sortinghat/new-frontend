import useGraph from "../../hooks/useGraph";
import styles from "./styles.module.css";

const Graph = ({
  system,
  dimensions,
  depth,
  selected,
  onSelection,
  seeModules,
  showOperations,
  focusedComponent,
}) => {
  const graphRef = useGraph({
    system,
    dimensions,
    depth,
    selected,
    onSelection,
    seeModules,
    showOperations,
    focusedComponent,
  });

  return (
    <div className={styles.graphContainer}>
      <div ref={graphRef} className={styles.graph}></div>
    </div>
  );
};

export default Graph;
