export function addEventListeners() {
    document.getElementById('select-tool').addEventListener('click', () => this.activateTool('select'));
    document.getElementById('point-tool').addEventListener('click', () => this.activateTool('point'));
    document.getElementById('line-tool').addEventListener('click', () => this.activateTool('line'));
    document.getElementById('hand-tool').addEventListener('click', () => this.activateTool('hand'));
    
    const strokeColorInput = document.getElementById('stroke-color');
    if (strokeColorInput) {
        strokeColorInput.addEventListener('input', () => {
            this.strokeColor = strokeColorInput.value;
            this.updateSelectedItemStyle();
        });
    }
    
    const toggleGridBtn = document.getElementById('toggle-grid');
    if (toggleGridBtn) {
        toggleGridBtn.addEventListener('click', () => {
            this.showGrid = !this.showGrid;
            this.setupCoordinateSystem();
            toggleGridBtn.textContent = this.showGrid ? 'Hide Grid' : 'Show Grid';
        });
    }
    
    const toggleSnapBtn = document.getElementById('toggle-snap');
    if (toggleSnapBtn) {
        toggleSnapBtn.addEventListener('click', () => {
            this.toggleSnapToGrid();
        });
    }
    
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteSelectedItem());
    }
    
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearCanvas());
    }
    
    window.addEventListener('resize', () => {
        setTimeout(() => this.setupCoordinateSystem(), 100);
    });
}