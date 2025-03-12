export function snapToGrid(point) {
    if (!this.snapEnabled) return point;
    
    const x = Math.round(point.x / this.gridSize) * this.gridSize;
    const y = Math.round(point.y / this.gridSize) * this.gridSize;
    
    return new paper.Point(x, y);
}

export function toggleSnapToGrid() {
    this.snapEnabled = !this.snapEnabled;
    const snapBtn = document.getElementById('toggle-snap');
    if (snapBtn) {
        snapBtn.textContent = this.snapEnabled ? 'Snap: ON' : 'Snap: OFF';
    }
}