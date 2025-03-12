export function createPoint(position) {
    if (this.snapEnabled) {
        position = this.snapToGrid(position);
    }
    
    const point = new paper.Path.Circle({
        center: position,
        radius: this.pointSize,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        data: {
            type: 'point',
            coordinates: [position.x, position.y, 0]
        }
    });
    
    this.shapesGroup.addChild(point);
    this.shapes.push(point);
    
    if (this.showCoordinates) {
        const coordText = new paper.PointText({
            point: new paper.Point(position.x + this.pointSize + 2, position.y - this.pointSize),
            content: `(${Math.round(position.x)},${Math.round(position.y)})`,
            fontSize: 10,
            fillColor: '#000000',
            data: {
                type: 'label',
                parent: point,
                isCoordinateLabel: true
            }
        });
        this.shapesGroup.addChild(coordText);
        
        const group = new paper.Group([point, coordText]);
        group.data = {
            type: 'pointGroup',
            point: point,
            label: coordText
        };
    }
    
    return point;
}