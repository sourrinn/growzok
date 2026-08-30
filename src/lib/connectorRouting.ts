export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  cx: number;
  cy: number;
}

/**
 * Calculates a collision-free SVG Bezier curve path string between source and target nodes
 * while routing around intermediate obstacle bounding boxes on the canvas.
 */
export function calculateCollisionFreePath(
  source: { x: number; y: number; width?: number; height?: number },
  target: { x: number; y: number; width?: number; height?: number },
  obstacles: Array<{ id: string; x: number; y: number; width?: number; height?: number }>,
  sourceId: string,
  targetId: string
): string {
  const sW = source.width || 220;
  const sH = source.height || 140;
  const tW = target.width || 220;
  const tH = target.height || 140;

  // Center points
  const sCenter: Point = { x: source.x + sW / 2, y: source.y + sH / 2 };
  const tCenter: Point = { x: target.x + tW / 2, y: target.y + tH / 2 };

  // Calculate best connection ports (Top, Bottom, Left, Right)
  const dx = tCenter.x - sCenter.x;
  const dy = tCenter.y - sCenter.y;

  let start: Point;
  let end: Point;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant routing
    if (dx > 0) {
      start = { x: source.x + sW, y: sCenter.y };
      end = { x: target.x, y: tCenter.y };
    } else {
      start = { x: source.x, y: sCenter.y };
      end = { x: target.x + tW, y: tCenter.y };
    }
  } else {
    // Vertical dominant routing
    if (dy > 0) {
      start = { x: sCenter.x, y: source.y + sH };
      end = { x: tCenter.x, y: target.y };
    } else {
      start = { x: sCenter.x, y: source.y };
      end = { x: tCenter.x, y: target.y + tH };
    }
  }

  // Check if straight path intersects any obstacle bounding box
  const obstacleBoxes: BoundingBox[] = obstacles
    .filter((o) => o.id !== sourceId && o.id !== targetId)
    .map((o) => {
      const w = o.width || 220;
      const h = o.height || 140;
      const pad = 20; // 20px clearance padding around elements
      return {
        id: o.id,
        left: o.x - pad,
        top: o.y - pad,
        right: o.x + w + pad,
        bottom: o.y + h + pad,
        cx: o.x + w / 2,
        cy: o.y + h / 2,
      };
    });

  // Calculate Bezier control points for smooth fluid curve
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Check if any obstacle lies in the direct line path
  const collidingObstacles = obstacleBoxes.filter((box) => {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    return box.right > minX && box.left < maxX && box.bottom > minY && box.top < maxY;
  });

  let cp1X = midX;
  let cp1Y = start.y;
  let cp2X = midX;
  let cp2Y = end.y;

  if (collidingObstacles.length > 0) {
    // Offset control points around obstacle bounding boxes
    const avgObsY = collidingObstacles.reduce((acc, b) => acc + b.cy, 0) / collidingObstacles.length;
    const offset = avgObsY > midY ? -60 : 60; // Curve above or below obstacle

    if (Math.abs(dx) > Math.abs(dy)) {
      cp1X = midX;
      cp1Y = start.y + offset;
      cp2X = midX;
      cp2Y = end.y + offset;
    } else {
      const avgObsX = collidingObstacles.reduce((acc, b) => acc + b.cx, 0) / collidingObstacles.length;
      const xOffset = avgObsX > midX ? -60 : 60;
      cp1X = start.x + xOffset;
      cp1Y = midY;
      cp2X = end.x + xOffset;
      cp2Y = midY;
    }
  } else {
    // Standard smooth S-curve Bezier control points
    if (Math.abs(dx) > Math.abs(dy)) {
      cp1X = start.x + dx / 2;
      cp1Y = start.y;
      cp2X = end.x - dx / 2;
      cp2Y = end.y;
    } else {
      cp1X = start.x;
      cp1Y = start.y + dy / 2;
      cp2X = end.x;
      cp2Y = end.y - dy / 2;
    }
  }

  return `M ${start.x} ${start.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${end.x} ${end.y}`;
}
