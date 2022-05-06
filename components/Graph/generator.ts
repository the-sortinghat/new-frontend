import ForceGraph from "force-graph";

function curveLinks(gData: any): any {
  let selfLoopLinks = {} as any;
  let sameNodesLinks = {} as any;
  const curvatureMinMax = 0.5;

  // 1. assign each link a nodePairId that combines their source and target independent of the links direction
  // 2. group links together that share the same two nodes or are self-loops
  gData.links.forEach((link: any) => {
    link.nodePairId =
      link.source <= link.target
        ? link.source + "_" + link.target
        : link.target + "_" + link.source;
    let map = link.source === link.target ? selfLoopLinks : sameNodesLinks;
    if (!map[link.nodePairId]) {
      map[link.nodePairId] = [];
    }
    map[link.nodePairId].push(link);
  });

  // Compute the curvature for self-loop links to avoid overlaps
  Object.keys(selfLoopLinks).forEach((id) => {
    let links = selfLoopLinks[id];
    let lastIndex = links.length - 1;
    links[lastIndex].curvature = 1;
    let delta = (1 - curvatureMinMax) / lastIndex;
    for (let i = 0; i < lastIndex; i++) {
      links[i].curvature = curvatureMinMax + i * delta;
    }
  });

  // Compute the curvature for links sharing the same two nodes to avoid overlaps
  Object.keys(sameNodesLinks)
    .filter((nodePairId) => sameNodesLinks[nodePairId].length > 1)
    .forEach((nodePairId) => {
      let links = sameNodesLinks[nodePairId];
      let lastIndex = links.length - 1;
      let lastLink = links[lastIndex];
      lastLink.curvature = curvatureMinMax;
      let delta = (2 * curvatureMinMax) / lastIndex;
      for (let i = 0; i < lastIndex; i++) {
        links[i].curvature = -curvatureMinMax + i * delta;
        if (lastLink.source !== links[i].source) {
          links[i].curvature *= -1; // flip it around, otherwise they overlap
        }
      }
    });

  return gData;
}

function dashAsyncLinks(gData: any): any {
  return {
    nodes: [...gData.nodes],
    links: gData.links.map((link: any) => ({
      ...link,
      dashed: link.type === "async",
    })),
  };
}

function processLinks(gData: any): any {
  gData = curveLinks(gData);
  gData = dashAsyncLinks(gData);
  return gData;
}

export default function GraphGenerator(payload: any) {
  const { data, width, height, container } = payload;
  const graph = ForceGraph()(container);

  const gData = processLinks(data);

  graph
    .width(width)
    .height(height)
    .graphData(gData)
    .nodeCanvasObject((node: any, canvasCtx) => {
      canvasCtx.beginPath();

      canvasCtx.fillStyle = "#6b46c1";
      //canvasCtx.fillRect(node.x - 6, node.y - 4, 12, 8);
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
    .linkCurvature("curvature")
    .linkLineDash((link: any) => link.dashed && [2, 2])
    .linkWidth(2)
    .linkDirectionalArrowLength(6)
    .linkDirectionalArrowRelPos(1)
    .zoom(5);
}
