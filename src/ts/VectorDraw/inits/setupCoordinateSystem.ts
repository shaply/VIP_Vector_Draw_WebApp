import VectorDrawingApp from "../VectorDrawingApp";

export function setupCoordinateSystem(app: VectorDrawingApp) {
    const view = paper.view;
    
    app.gridGroup.removeChildren();
    
    if (app.showGrid) {
        const gridSize = app.gridSize;
        
        const startX = Math.floor(view.bounds.left / gridSize) * gridSize;
        const endX = Math.ceil(view.bounds.right / gridSize) * gridSize;
        const startY = Math.floor(view.bounds.top / gridSize) * gridSize;
        const endY = Math.ceil(view.bounds.bottom / gridSize) * gridSize;
        
        for (let x = startX; x <= endX; x += gridSize) {
            const line = new paper.Path.Line(
                new paper.Point(x, view.bounds.top),
                new paper.Point(x, view.bounds.bottom)
            );
            line.strokeColor = '#e0e0e0';
            line.strokeWidth = 0.5;
            app.gridGroup.addChild(line);
        }
        
        for (let y = startY; y <= endY; y += gridSize) {
            const line = new paper.Path.Line(
                new paper.Point(view.bounds.left, y),
                new paper.Point(view.bounds.right, y)
            );
            line.strokeColor = '#e0e0e0';
            line.strokeWidth = 0.5;
            app.gridGroup.addChild(line);
        }
    }
    
    app.gridGroup.sendToBack();
}