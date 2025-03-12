import { snapToGrid } from "../util/snapToGridUtils";
import VectorDrawingApp from "../VectorDrawingApp";

export function createPoint(app: VectorDrawingApp, position: paper.Point): paper.Path.Circle {
    if (app.snapEnabled) {
        position = snapToGrid(app, position);
    }
    
    const point = new paper.Path.Circle({
        center: position,
        radius: app.pointSize,
        fillColor: app.fillColor,
        strokeColor: app.strokeColor,
        strokeWidth: app.strokeWidth,
        data: {
            type: 'point',
            coordinates: [position.x, position.y, 0]
        }
    });
    
    app.shapesGroup.addChild(point);
    app.shapes.push(point);
    
    if (app.showCoordinates) {
        const coordText = new paper.PointText({
            point: new paper.Point(position.x + app.pointSize + 2, position.y - app.pointSize),
            content: `(${Math.round(position.x)},${Math.round(position.y)})`,
            fontSize: 10,
            fillColor: '#000000',
            data: {
                type: 'label',
                parent: point,
                isCoordinateLabel: true
            }
        });
        app.shapesGroup.addChild(coordText);
        
        const group = new paper.Group([point, coordText]);
        group.data = {
            type: 'pointGroup',
            point: point,
            label: coordText
        };
    }
    
    return point;
}