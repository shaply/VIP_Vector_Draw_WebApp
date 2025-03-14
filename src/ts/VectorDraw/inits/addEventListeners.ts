import { activateTool } from "../tools/activateTool";
import { clearCanvas } from "../tools/clearCanvas";
import { deleteSelectedItem, updateSelectedItemStyle } from "../util/modifySelectedItem";
import VectorDrawingApp from "../VectorDrawingApp";
import { setupCoordinateSystem } from "./setupCoordinateSystem";

export function addEventListeners(app: VectorDrawingApp) {
    handleToolEventListeners(app);
    
    const strokeColorInput = document.getElementById('stroke-color');
    if (strokeColorInput) {
        strokeColorInput.addEventListener('input', () => {
            app.strokeColor = (strokeColorInput as HTMLInputElement).value;
            updateSelectedItemStyle(app);
        });
    }

    const toggleGridBtn = document.getElementById('toggle-grid');
    if (toggleGridBtn) {
        toggleGridBtn.addEventListener('click', () => {
            app.showGrid = !app.showGrid;
            setupCoordinateSystem(app);
            toggleGridBtn.textContent = app.showGrid ? 'Hide Grid' : 'Show Grid';
        });
    }
    
    handleSnapEventListeners(app);
    
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteSelectedItem(app));
    }
    
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => clearCanvas(app));
    }
    
    window.addEventListener('resize', () => {
        setTimeout(() => setupCoordinateSystem(app), 100);
    });
}

function handleToolEventListeners(app: VectorDrawingApp) {
    document.getElementById('select-tool')?.addEventListener('click', () => activateTool(app, 'select'));
    document.getElementById('point-tool')?.addEventListener('click', () => activateTool(app, 'point'));
    document.getElementById('line-tool')?.addEventListener('click', () => activateTool(app, 'line'));
    document.getElementById('circle-tool')?.addEventListener('click', () => activateTool(app, 'circle'));
    document.getElementById('hand-tool')?.addEventListener('click', () => activateTool(app, 'hand'));
}

function handleSnapEventListeners(app: VectorDrawingApp) {
    const toggleSnapBtn = document.getElementById('toggle-snap');
    if (toggleSnapBtn) {
        const snapOptionsModal = document.getElementById('snap-options-modal');
        toggleSnapBtn.addEventListener('click', () => {
            if (snapOptionsModal) {
                snapOptionsModal.style.display = 'flex';
            }
        })
        window.addEventListener('click', (event) => {
            if (snapOptionsModal && event.target === snapOptionsModal) {
                snapOptionsModal.style.display = 'none';
            }
        })
    }

    const snapToGridCheckbox = document.getElementById('snap-to-grid') as HTMLInputElement;
    if (snapToGridCheckbox) {
        snapToGridCheckbox.addEventListener('change', () => {
            app.snapToGrid = snapToGridCheckbox.checked;
        });
    }

    const snapToPointCheckbox = document.getElementById('snap-to-point') as HTMLInputElement;
    if (snapToPointCheckbox) {
        snapToPointCheckbox.addEventListener('change', () => {
            app.snapToPoint = snapToPointCheckbox.checked;
        });
    }
}