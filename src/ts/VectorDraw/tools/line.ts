import { Line } from "../types/shapes";
import { CustomTool } from "../types/tool";
import { applySnapping } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export class LineTool extends CustomTool {
    lineStart: paper.Point | null | undefined;
    currentPath: paper.Path | null | undefined;
    lastPoint: paper.Point | null | undefined;
    lastTime: number | null | undefined;

    deactivate() {
        // Logic to deactivate the tool
    }

    createLine(app: VectorDrawingApp, startPoint: paper.Point, endPoint: paper.Point): paper.Path.Line {
        const lineData: Line = {
            type: 'line',
            startPoint: startPoint,
            endPoint: endPoint
        }
        
        const line = new paper.Path.Line({
            from: startPoint,
            to: endPoint,
            strokeColor: app.strokeColor,
            strokeWidth: app.strokeWidth,
            data: lineData,
        });
        
        app.shapesGroup.addChild(line);
        app.shapes.push(line);
        
        return line;
    }
}

export function setupLineTool(app: VectorDrawingApp) {
    const lineTool = new LineTool();
    app.lineTool = lineTool;
    lineTool.onMouseDown = function(event) {
        let startPoint = event.point;
        startPoint = applySnapping(app, startPoint);
        lineTool.lineStart = startPoint;
        lineTool.currentPath = new paper.Path();
        lineTool.currentPath.strokeColor = app.strokeColor;
        lineTool.currentPath.strokeWidth = app.strokeWidth;
        lineTool.currentPath.add(lineTool.lineStart);
    };
    
    lineTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        currentPoint = applySnapping(app, currentPoint);
        
        if (!lineTool.currentPath) { // null or undefined check
            return;
        }

        if (lineTool.currentPath.segments.length > 1) {
            lineTool.currentPath.removeSegments(1);
        }
        
        lineTool.currentPath.add(currentPoint);
    };
    
    lineTool.onMouseUp = function(event) {
        let endPoint = event.point;
        endPoint = applySnapping(app, endPoint);
        
        if (!lineTool.lineStart) { // null or undefined check
            return;
        }

        lineTool.createLine(app, lineTool.lineStart, endPoint);
        
        lineTool.currentPath?.remove();
        lineTool.currentPath = null;
    };
}