import { useEffect, useState } from "react";
import GraphGenerator from "@/services/graph/generator";
import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";

type Props = { system: System; dimensions: Dimensions };

const Graph: React.FC<Props> = ({ system, dimensions }) => {
  const [zoom, setZoom] = useState(0.5);

  useEffect(() => {
    GraphGenerator({
      system,
      dimensions,
      container: document.getElementById("graph")!,
      options: { zoom },
    });
  }, [dimensions, system, zoom]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        border: "1px solid #ccc",
      }}
    >
      <div id="graph" style={{ width: "100%", height: "100%" }}></div>
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
            if (zoom > 0.5) setZoom(zoom - 0.5);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Graph;
