import { setupCircleTool } from "../tools/circle";
import { setupHandTool } from "../tools/hand";
import { setupLineTool } from "../tools/line";
import { setupPointTool } from "../tools/point";
import { setupSelectTool } from "../tools/select";
import { giveSnapPointToTool } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export function initializeTools(app: VectorDrawingApp) {
    setupSelectTool(app);
    setupPointTool(app);
    setupLineTool(app);
    setupCircleTool(app);
    setupHandTool(app);

    // Attach additional logic to the onMouseMove methods of all tools
    const hasSnapTools = [app.pointTool, app.lineTool, app.circleTool];
    hasSnapTools.forEach(tool => {
        if (tool) {
            giveSnapPointToTool(app, tool);
        }
    });
}