import ForceGraph from "force-graph";

export default function GraphGenerator(payload: any) {
  const { data, width, height, container } = payload;
  const graph = ForceGraph()(container);
  graph
    .width(width)
    .height(height)
    .graphData(data)
    .nodeCanvasObject((node: any, canvasCtx) => {
      canvasCtx.beginPath();

      canvasCtx.fillStyle = "#6b46c1";
      canvasCtx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);
      canvasCtx.stroke();
      canvasCtx.lineWidth = 0.5;
      canvasCtx.fill();

      canvasCtx.fillStyle = "black";
      canvasCtx.font = `3px 'Montserrat'`;
      canvasCtx.textAlign = "center";
      canvasCtx.textBaseline = "middle";
      canvasCtx.fillText(node.name, node.x, node.y + 6);
    })
    .linkDirectionalArrowLength(6)
    .linkDirectionalArrowRelPos(1)
    .zoom(5);
}
