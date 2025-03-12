import VectorDrawingApp from "../VectorDrawingApp";

/**
 * Need to fix the return type to something that isn't any
 * @param app 
 * @returns 
 */
export function exportShapesData(app: VectorDrawingApp): any[] {
    const shapesData: any[] = [];
    
    app.shapes.forEach(shape => {
        if (shape.data) {
            if (shape.data.type === 'point') {
                shapesData.push({
                    type: 'point',
                    coordinates: shape.data.coordinates
                });
            }
            else if (shape.data.type === 'line') {
                shapesData.push({
                    type: 'line',
                    startCoordinates: shape.data.startCoordinates,
                    endCoordinates: shape.data.endCoordinates
                });
            }
        }
    });
    
    return shapesData;
}