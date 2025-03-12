import VectorDrawingApp from "../VectorDrawingApp";

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