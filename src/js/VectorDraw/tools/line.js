export function createLine(startPoint, endPoint) {
    const line = new paper.Path.Line({
        from: startPoint,
        to: endPoint,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        data: {
            type: 'line'
        }
    });
    
    this.shapesGroup.addChild(line);
    this.shapes.push(line);
    
    return line;
}