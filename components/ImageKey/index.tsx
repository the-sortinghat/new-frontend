import CytoscapeComponent from "react-cytoscapejs";

const ImageKey: React.FC = () => {
  const elements = CytoscapeComponent.normalizeElements({
    nodes: [
      { data: { type: "ellipse", caption: "Service" } },
      {
        data: { type: "rectangle", caption: "Module" },
      },
      { data: { type: "hexagon", caption: "Database" } },

      { data: { id: "n01", type: "ellipse" } },
      { data: { id: "n02", type: "ellipse" } },

      { data: { id: "n03", type: "ellipse" } },
      { data: { id: "n04", type: "ellipse" } },

      { data: { id: "n05", type: "elipse" } },
      { data: { id: "n06", type: "hexagon" } },
    ],
    edges: [
      {
        data: {
          id: "n01n02",
          source: "n01",
          target: "n02",
          type: "sync",
          caption: "Synchronous call",
        },
      },
      {
        data: {
          id: "n03n04",
          source: "n03",
          target: "n04",
          type: "async",
          caption: "Asynchronous call",
        },
      },
      {
        data: {
          id: "n05n06",
          source: "n05",
          target: "n06",
          label: "R/W",
          type: "db",
          caption: "Database usage",
        },
      },
    ],
  });
  return (
    <>
      <h2>Image key</h2>
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%", border: "1px solid #cccccc" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              shape:
                "data(type)" as cytoscape.Css.PropertyValueNode<cytoscape.Css.NodeShape>,
              label: "data(caption)",
              height: 18,
              width: 18,
              "font-size": 12,
              "text-valign": "bottom",
              "text-halign": "center",
              "text-margin-y": 10,
            },
          },
          {
            selector: "node[type='rectangle']",
            style: {
              width: 30,
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              label: "data(caption)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "arrow-scale": 1,
              "font-size": 12,
              "text-valign": "bottom",
              "text-halign": "center",
              "text-margin-y": 20,
            },
          },
          {
            selector: "edge[type = 'async']",
            style: {
              "line-style": "dashed",
            },
          },
        ]}
        minZoom={2}
        maxZoom={2}
        autoungrabify={true}
        autounselectify={true}
        boxSelectionEnabled={false}
        userPanningEnabled={false}
        panningEnabled={false}
        layout={{
          name: "grid",
          ready: (_) => {},
        }}
      />
    </>
  );
};

export default ImageKey;
