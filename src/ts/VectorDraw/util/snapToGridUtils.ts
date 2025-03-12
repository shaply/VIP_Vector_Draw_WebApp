import VectorDrawingApp from "../VectorDrawingApp";

export function snapToGrid(app: VectorDrawingApp, point: paper.Point): paper.Point {
    if (!app.snapEnabled) return point;
    
    const x = Math.round(point.x / app.gridSize) * app.gridSize;
    const y = Math.round(point.y / app.gridSize) * app.gridSize;
    
    return new paper.Point(x, y);
}

export function toggleSnapToGrid(app: VectorDrawingApp) {
    app.snapEnabled = !app.snapEnabled;
    const snapBtn = document.getElementById('toggle-snap');
    if (snapBtn) {
        snapBtn.textContent = app.snapEnabled ? 'Snap: ON' : 'Snap: OFF';
    }
}