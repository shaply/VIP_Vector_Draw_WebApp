import { setupCircleTool } from "../tools/circle";
import { setupHandTool } from "../tools/hand";
import { setupLineTool } from "../tools/line";
import { setupPointTool } from "../tools/point";
import { setupSelectTool } from "../tools/select";
import VectorDrawingApp from "../VectorDrawingApp";
import { setupCoordinateSystem } from "./setupCoordinateSystem";

export function initializeTools(app: VectorDrawingApp) {
    
    setupSelectTool(app);
    
    setupPointTool(app);
    
    setupLineTool(app);

    setupCircleTool(app);

    setupHandTool(app);
}