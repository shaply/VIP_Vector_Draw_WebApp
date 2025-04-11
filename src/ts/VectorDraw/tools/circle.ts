import { Circle } from "../types/shapes";
import { CustomTool } from "../types/tool";
import { applySnapping } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export class CircleTool extends CustomTool {
    circleStart: paper.Point | null | undefined;
    currentCircle: paper.Path | null | undefined;

    deactivate() {
        // Logic to deactivate the tool
    }

    createCircle(app: VectorDrawingApp, centerPoint: paper.Point, endPoint: paper.Point): paper.Path.Circle {
        const radius = centerPoint.getDistance(endPoint);
    
        const circleData: Circle = {
            center: centerPoint,
            radius: radius,
            type: 'circle',
        }
        const circle = new paper.Path.Circle({
            center: centerPoint,
            radius: radius,
            strokeColor: app.strokeColor,
            strokeWidth: app.strokeWidth,
            data: circleData
        });
    
        app.shapesGroup.addChild(circle);
        app.shapes.push(circle);
    
        return circle;
    }
}

export function setupCircleTool(app: VectorDrawingApp) {
    const circleTool = new CircleTool();
    app.circleTool = circleTool;
    
    circleTool.onMouseDown = function(event) {
        let centerPoint = event.point;
        centerPoint = applySnapping(app, centerPoint);
        circleTool.circleStart = centerPoint;
        circleTool.currentCircle = new paper.Path.Circle({
            center: circleTool.circleStart,
            radius: 0
        });
        circleTool.currentCircle.strokeColor = app.strokeColor;
        circleTool.currentCircle.strokeWidth = app.strokeWidth;
    }

    circleTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        currentPoint = applySnapping(app, currentPoint);

        if (!circleTool.currentCircle) { // null or undefined check
            return;
        }

        let radius = circleTool.circleStart?.getDistance(currentPoint);
        circleTool.currentCircle.remove();
        circleTool.currentCircle = new paper.Path.Circle({
            center: circleTool.circleStart,
            radius: radius
        });
        circleTool.currentCircle.strokeColor = app.strokeColor;
        circleTool.currentCircle.strokeWidth = app.strokeWidth;
    }

    app.circleTool.onMouseUp = function(event) {
        let endPoint = event.point;
        endPoint = applySnapping(app, endPoint);

        if (!circleTool.circleStart) { // null or undefined check
            return;
        }

        circleTool.createCircle(app, circleTool.circleStart, endPoint);

        circleTool.currentCircle?.remove();
        circleTool.currentCircle = null;
    }
}