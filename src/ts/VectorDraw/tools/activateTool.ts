import VectorDrawingApp from "../VectorDrawingApp";
import { updateToolUI } from "../util/updateToolUI";

export function activateTool(app: VectorDrawingApp, toolName: string) {
    app.currentToolName = toolName;

    // Deactivate the current tool if it exists
    if (app.currentTool) {
        app.currentTool.deactivate();
        app.currentTool = null;
        document.body.style.cursor = 'default';
    }
    
    switch (toolName) {
        case 'select':
            if (!app.selectTool) {
                throw new Error('Select tool not initialized');
            }
            app.selectTool.activate();
            app.currentTool = app.selectTool;
            document.body.style.cursor = 'default';
            break;
        case 'point':
            if (!app.pointTool) {
                throw new Error('Point tool not initialized');
            }
            app.pointTool.activate();
            app.currentTool = app.pointTool;
            document.body.style.cursor = 'crosshair';
            break;
        case 'line':
            if (!app.lineTool) {
                throw new Error('Line tool not initialized');
            }
            app.lineTool.activate();
            app.currentTool = app.lineTool;
            document.body.style.cursor = 'crosshair';
            break;
        case 'circle':
            if (!app.circleTool) {
                throw new Error('Circle tool not initialized');
            }
            app.circleTool.activate();
            app.currentTool = app.circleTool;
            document.body.style.cursor = 'crosshair';
            break;
        case 'hand':
            if (!app.handTool) {
                throw new Error('Hand tool not initialized');
            }
            app.handTool.activate();
            app.currentTool = app.handTool;
            document.body.style.cursor = 'grab';
            break;
    }
    
    updateToolUI(toolName);
}