export const drawService = (node: any, ctx: any) => {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 3 * 1.4, 0, 2 * Math.PI, false);
  ctx.fillStyle = node.clicked
    ? "orange"
    : node.highlighted
    ? "#6b46c1"
    : "#CCC";
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = `3px 'Montserrat'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.label, node.x, node.y + 9);
};

export const drawDatabase = (node: any, ctx: any) => {
  const img = new Image();
  img.src = "/assets/database.svg";
  const size = 8;
  ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
  ctx.fillStyle = "black";
  ctx.font = `3px 'Montserrat'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.label, node.x, node.y + 10);
};

export const drawOperation = (node: any, ctx: any) => {
  ctx.beginPath();
  const width = 5;
  const height = 5;
  ctx.moveTo(node.x, node.y);
  // top left edge
  ctx.lineTo(node.x - width / 2, node.y + height / 2);

  // bottom left edge
  ctx.lineTo(node.x, node.y + height);

  // bottom right edge
  ctx.lineTo(node.x + width / 2, node.y + height / 2);
  ctx.fillStyle = node.highlighted ? "#6b46c1" : "blue";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = `3px 'Montserrat'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.label, node.x, node.y + 6);
};

export const drawLinkLabelForDatabaseUsages = (
  nodeRelSize: number,
  link: any,
  ctx: any
) => {
  const MAX_FONT_SIZE = 4;
  const LABEL_NODE_MARGIN = nodeRelSize * 1.5;

  const start = link.source;
  const end = link.target;

  // ignore unbound links
  if (typeof start !== "object" || typeof end !== "object") return;

  // calculate label positioning
  const textPos = Object.assign(
    ["x", "y"].map((c) => ({
      [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
    }))
  );

  const relLink = { x: end.x - start.x, y: end.y - start.y };

  const maxTextLength =
    Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
    LABEL_NODE_MARGIN * 2;

  let textAngle = Math.atan2(relLink.y, relLink.x);
  // maintain label vertical orientation for legibility
  if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
  if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

  // estimate fontSize to fit in link length
  ctx.font = "1px Sans-Serif";
  const fontSize = Math.min(
    MAX_FONT_SIZE,
    maxTextLength / ctx.measureText(link.label).width
  );
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(link.label).width;
  const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

  // draw text link.label (with background rect)
  ctx.save();
  ctx.translate(textPos.x, textPos.y);
  ctx.rotate(textAngle);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(
    -bckgDimensions[0] / 2,
    -bckgDimensions[1] / 2,
    ...bckgDimensions
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "darkgrey";
  ctx.fillText(link.label, 0, 0);
  ctx.restore();
};
