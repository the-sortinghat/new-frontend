import { useEffect } from "react";
import GraphGenerator from "./generator";
import styles from "./styles.module.css";

const Graph: React.FC = () => {
  const data = {
    nodes: [
      { id: 1, label: "Actuator Controller" },
      { id: 2, label: "Data Collector" },
      { id: 3, label: "Resource Adaptor" },
      { id: 4, label: "Resource Catalog" },
      { id: 5, label: "Resource Discovery" },
    ],
    edges: [
      { from: 1, to: 2, type: "sync" },
      { from: 1, to: 3, type: "sync" },
      { from: 3, to: 2, type: "async" },
      { from: 3, to: 4, type: "async" },
      { from: 4, to: 5, type: "async" },
      { from: 5, to: 4, type: "sync" },
      { from: 5, to: 3, type: "async" },
      { from: 5, to: 3, type: "sync" },
      { from: 5, to: 2, type: "async" },
    ],
  };

  useEffect(() => {
    GraphGenerator({ data, container: document.getElementById("graph") });
  });

  return <div id="graph" className={styles.graph}></div>;
};

export default Graph;
