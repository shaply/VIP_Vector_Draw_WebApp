import VectorDrawingApp from "../VectorDrawingApp";

/**
 * Handles all the snapping logic
 * @param app 
 * @param point
 * @returns the snapped point
 */
export function applySnapping(app: VectorDrawingApp, point: paper.Point): paper.Point {
    let snappedPoint = point;
    snappedPoint = snapToGrid(app, snappedPoint);
    snappedPoint = snapToPoint(app, snappedPoint);
    return snappedPoint;
}

function snapToGrid(app: VectorDrawingApp, point: paper.Point): paper.Point {
    if (!app.snapToGrid) return point;
    
    const x = Math.round(point.x / app.gridSize) * app.gridSize;
    const y = Math.round(point.y / app.gridSize) * app.gridSize;
    
    return new paper.Point(x, y);
}

function snapToPoint(app: VectorDrawingApp, point: paper.Point): paper.Point {
    if (!app.snapToPoint) return point;

    let closestPoint = null;
    let minDistance = 20;
    for (const shape of app.shapes) {
        if (shape.data.type === 'point') {
            const distance = shape.position.getDistance(point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = shape.position;
            }
        }
    }
    return closestPoint || point;
}