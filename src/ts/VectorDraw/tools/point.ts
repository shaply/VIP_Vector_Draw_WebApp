import { Point } from "../types/shapes";
import { CustomTool } from "../types/tool";
import { applySnapping } from "../util/snapUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export class PointTool extends CustomTool {
    deactivate() {

    }

    createPoint(app: VectorDrawingApp, position: paper.Point): paper.Path.Circle {
        position = applySnapping(app, position);
        
        const pointData: Point = {
            type: 'point',
            point: position,
        }
        const point = new paper.Path.Circle({
            center: position,
            radius: app.pointSize,
            fillColor: app.fillColor,
            strokeColor: app.strokeColor,
            strokeWidth: app.strokeWidth,
            data: pointData
        });
        
        app.shapesGroup.addChild(point);
        app.shapes.push(point);
        
        return point;
    }
}

export function setupPointTool(app: VectorDrawingApp) {
    const pointTool = new PointTool();
    app.pointTool = pointTool;
    pointTool.onMouseDown = function(event) {
        let position = event.point;
        position = applySnapping(app, position);
        pointTool.createPoint(app, position);
    };
}