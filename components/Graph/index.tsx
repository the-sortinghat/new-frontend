import { useEffect } from "react";
import GraphGenerator from "./generator";
import styles from "./styles.module.css";

const Graph: React.FC = () => {
  const data = {
    nodes: [
      { id: 1, name: "Actuator Controller" },
      { id: 2, name: "Data Collector" },
      { id: 3, name: "Resource Adaptor" },
      { id: 4, name: "Resource Catalog" },
      { id: 5, name: "Resource Discovery" },
    ],
    links: [
      { source: 1, target: 2, type: "sync" },
      { source: 1, target: 3, type: "sync" },
      { source: 3, target: 2, type: "async" },
      { source: 3, target: 4, type: "async" },
      { source: 4, target: 5, type: "async" },
      { source: 5, target: 4, type: "sync" },
      { source: 5, target: 3, type: "async" },
      { source: 5, target: 3, type: "sync" },
      { source: 5, target: 2, type: "async" },
    ],
  };

  useEffect(() => {
    const frame = document.getElementById("graph");

    GraphGenerator({
      data,
      width: frame?.clientWidth,
      height: frame?.clientHeight,
      container: frame,
    });
  });

  return <div id="graph" className={styles.graph}></div>;
};

export default Graph;
