import { useEffect } from "react";
import GraphGenerator from "../services/graph/generator";
import { Dimensions } from "../types/dimensions";
import { System } from "../types/system";

type Props = { system: System; dimensions: Dimensions };

const Graph: React.FC<Props> = ({ system, dimensions }) => {
  useEffect(() => {
    GraphGenerator({
      system,
      dimensions,
      container: document.getElementById("graph")!,
    });
  });

  return (
    <div
      id="graph"
      style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
    ></div>
  );
};

export default Graph;
