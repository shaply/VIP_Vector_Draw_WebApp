import { snapToGrid } from "../util/snapToGridUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export function setupLineTool(app: VectorDrawingApp) {
    app.lineTool = new paper.Tool();
    app.lineTool.onMouseDown = function(event) {
        let startPoint = event.point;
        if (app.snapEnabled) {
            startPoint = snapToGrid(app, startPoint);
        }
        app.lineStart = startPoint;
        app.currentPath = new paper.Path();
        app.currentPath.strokeColor = app.strokeColor;
        app.currentPath.strokeWidth = app.strokeWidth;
        app.currentPath.add(app.lineStart);
    };
    
    app.lineTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        if (app.snapEnabled) {
            currentPoint = snapToGrid(app, currentPoint);
        }
        
        if (!app.currentPath) { // null or undefined check
            return;
        }

        if (app.currentPath.segments.length > 1) {
            app.currentPath.removeSegments(1);
        }
        
        app.currentPath.add(currentPoint);
    };
    
    app.lineTool.onMouseUp = function(event) {
        let endPoint = event.point;
        if (app.snapEnabled) {
            endPoint = snapToGrid(app, endPoint);
        }
        
        if (!app.lineStart) { // null or undefined check
            return;
        }

        createLine(app, app.lineStart, endPoint);
        
        app.currentPath?.remove();
        app.currentPath = null;
    };
}

export function createLine(app: VectorDrawingApp, startPoint: paper.Point, endPoint: paper.Point): paper.Path.Line {
    const line = new paper.Path.Line({
        from: startPoint,
        to: endPoint,
        strokeColor: app.strokeColor,
        strokeWidth: app.strokeWidth,
        data: {
            type: 'line'
        }
    });
    
    app.shapesGroup.addChild(line);
    app.shapes.push(line);
    
    return line;
}