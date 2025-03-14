import { applySnapping } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export function setupCircleTool(app: VectorDrawingApp) {
    app.circleTool = new paper.Tool();
    
    app.circleTool.onMouseDown = function(event) {
        let centerPoint = event.point;
        centerPoint = applySnapping(app, centerPoint);
        app.circleStart = centerPoint;
        app.currentCircle = new paper.Path.Circle({
            center: app.circleStart,
            radius: 0
        });
        app.currentCircle.strokeColor = app.strokeColor;
        app.currentCircle.strokeWidth = app.strokeWidth;
    }

    app.circleTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        currentPoint = applySnapping(app, currentPoint);

        if (!app.currentCircle) { // null or undefined check
            return;
        }

        let radius = app.circleStart?.getDistance(currentPoint);
        app.currentCircle.remove();
        app.currentCircle = new paper.Path.Circle({
            center: app.circleStart,
            radius: radius
        });
        app.currentCircle.strokeColor = app.strokeColor;
        app.currentCircle.strokeWidth = app.strokeWidth;
    }

    app.circleTool.onMouseUp = function(event) {
        let endPoint = event.point;
        endPoint = applySnapping(app, endPoint);

        if (!app.circleStart) { // null or undefined check
            return;
        }

        createCircle(app, app.circleStart, endPoint);

        app.currentCircle?.remove();
        app.currentCircle = null;
    }
}

export function createCircle(app: VectorDrawingApp, centerPoint: paper.Point, endPoint: paper.Point): paper.Path.Circle {
    const radius = centerPoint.getDistance(endPoint);
    const circle = new paper.Path.Circle({
        center: centerPoint,
        radius: radius,
        strokeColor: app.strokeColor,
        strokeWidth: app.strokeWidth,
        data: {
            type: 'circle'
        }
    });

    app.shapesGroup.addChild(circle);
    app.shapes.push(circle);

    return circle;
}