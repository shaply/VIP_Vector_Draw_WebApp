import { setupCircleTool } from "../tools/circle";
import { setupHandTool } from "../tools/hand";
import { setupLineTool } from "../tools/line";
import { setupPointTool } from "../tools/point";
import { setupSelectTool } from "../tools/select";
import { applySnapping } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export function initializeTools(app: VectorDrawingApp) {
    setupSelectTool(app);
    setupPointTool(app);
    setupLineTool(app);
    setupCircleTool(app);
    setupHandTool(app);

    // Attach additional logic to the onMouseMove methods of all tools
    const hasSnapTools = [app.selectTool, app.handTool, app.pointTool, app.lineTool, app.circleTool];
    hasSnapTools.forEach(tool => {
        if (tool) {
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
            }
        }
    });
}

let snapPoint: paper.Path.Circle | null = null; // Persistent snap point

function handleMouseMoveAndDrag(app: VectorDrawingApp, event: paper.ToolEvent) {
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
            fillColor: 'red'
        });
    } else {
        // Update the position of the existing snap point
        snapPoint.position = point;
    }
}