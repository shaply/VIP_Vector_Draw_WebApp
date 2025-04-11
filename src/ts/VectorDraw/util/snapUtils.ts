import { Line } from "../types/shapes";
import { CustomTool } from "../types/tool";
import VectorDrawingApp from "../VectorDrawingApp";

export interface SnapOptions {
  snapToGrid: boolean;
  snapToPoint: boolean;
  snapToLine: boolean;
}

const defaultSnapDistance = 10;
const nullPoint = new paper.Point(-1, -1);

/**
 * Handles all the snapping logic
 * @param app
 * @param point
 * @returns the snapped point
 */
export function applySnapping(
  app: VectorDrawingApp,
  point: paper.Point
): paper.Point {
  let snappedPoint = point;

  const wrapper = (newSnappedPoint: paper.Point): paper.Point => {
    if (newSnappedPoint === nullPoint) return snappedPoint;
    return newSnappedPoint;

    // const updatedPoint = tryNewSnappedPoint(point, snappedPoint, newSnappedPoint);
    // return updatedPoint;
  };

  snappedPoint = wrapper(snapToGrid(app, snappedPoint));
  snappedPoint = wrapper(snapToPoint(app, snappedPoint));
  snappedPoint = wrapper(snapToLine(app, snappedPoint));
  return snappedPoint;
}

function tryNewSnappedPoint(
  orig: paper.Point,
  oldSnap: paper.Point,
  newSnap: paper.Point
): paper.Point {
  if (newSnap === nullPoint) return oldSnap;
  const oldDistance = orig.getDistance(oldSnap);
  const newDistance = orig.getDistance(newSnap);
  return newDistance < oldDistance ? newSnap : oldSnap;
}

export function giveSnapPointToTool(app: VectorDrawingApp, tool: CustomTool) {
  let snapPoint: paper.Path.Circle | null = null; // Persistent snap point

  function handleMouseMoveAndDrag(
    app: VectorDrawingApp,
    event: paper.ToolEvent
  ) {
    // Apply snapping logic
    const snappedPoint = applySnapping(app, event.point);

    // Show the snap point visually
    showSnapPoint(app, snappedPoint);
  }

  function showSnapPoint(app: VectorDrawingApp, point: paper.Point) {
    if (!snapPoint) {
      // Create the snap point if it doesn't exist
      snapPoint = new paper.Path.Circle({
        center: point,
        radius: 3,
        fillColor: "red",
      });
    } else {
      // Update the position of the existing snap point
      snapPoint.position = point;
    }
  }

  const originalOnMouseMove = tool.onMouseMove; // Save the original method
  tool.onMouseMove = (event: paper.ToolEvent) => {
    // Call the original onMouseMove method if it exists
    if (originalOnMouseMove) {
      originalOnMouseMove.call(tool, event);
    }

    // Add new functionality (e.g., snapping logic)
    handleMouseMoveAndDrag(app, event);
  };

  const originalOnMouseDrag = tool.onMouseDrag; // Save the original method
  tool.onMouseDrag = (event: paper.ToolEvent) => {
    // Call the original onMouseDrag method if it exists
    if (originalOnMouseDrag) {
      originalOnMouseDrag.call(tool, event);
    }

    // Add new functionality (e.g., snapping logic)
    handleMouseMoveAndDrag(app, event);
  };

  const originalDeactivate = tool.deactivate; // Save the original method
  tool.deactivate = () => {
    // Call the original deactivate method if it exists
    if (originalDeactivate) {
      originalDeactivate.call(tool);
    }

    // Remove the snap point when the tool is deactivated
    if (snapPoint) {
      snapPoint.remove();
      snapPoint = null;
    }
  };
}

function snapToGrid(app: VectorDrawingApp, point: paper.Point): paper.Point {
  if (!app.snapOptions.snapToGrid) return point;

  const x = Math.round(point.x / app.gridSize) * app.gridSize;
  const y = Math.round(point.y / app.gridSize) * app.gridSize;

  return new paper.Point(x, y);
}

function snapToPoint(app: VectorDrawingApp, point: paper.Point): paper.Point {
  if (!app.snapOptions.snapToPoint) return point;

  let closestPoint = nullPoint;
  let minDistance = defaultSnapDistance;
  for (const shape of app.shapes) {
    if (shape.data.type === "point") {
      const distance = shape.position.getDistance(point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = shape.position;
      }
    }
  }
  return closestPoint || point;
}

function snapToLine(app: VectorDrawingApp, point: paper.Point): paper.Point {
  if (!app.snapOptions.snapToLine) return point;

  let closestPoint = nullPoint;
  let specialMinDistance = defaultSnapDistance; // used for snapping to special line points
  let minDistance = defaultSnapDistance;
  for (const shape of app.shapes) {
    if (shape.data.type === "line") {
      // Get nearest point in line
      const distance = shape.getNearestPoint(point).getDistance(point);
      if (distance < minDistance && specialMinDistance == defaultSnapDistance) {
        minDistance = distance;
        closestPoint = shape.getNearestPoint(point);
      }

      const lineData: Line = shape.data;
      if (lineData.startPoint.getDistance(point) < specialMinDistance) {
        specialMinDistance = lineData.startPoint.getDistance(point);
        closestPoint = lineData.startPoint;
      }
      if (lineData.endPoint.getDistance(point) < specialMinDistance) {
        specialMinDistance = lineData.endPoint.getDistance(point);
        closestPoint = lineData.endPoint;
      }
      const midPoint = shape.getPointAt(shape.length / 2);
      if (midPoint.getDistance(point) < specialMinDistance) {
        specialMinDistance = midPoint.getDistance(point);
        closestPoint = midPoint;
      }
    }
  }
  return closestPoint;
}
