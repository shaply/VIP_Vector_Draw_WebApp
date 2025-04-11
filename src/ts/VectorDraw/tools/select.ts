import { CustomTool } from "../types/tool";
import VectorDrawingApp from "../VectorDrawingApp";

export class SelectTool extends CustomTool {
    selectedItem: any;

    deactivate() {
        this.unselectSelectedItem();
    }

    unselectSelectedItem() {
        if (this.selectedItem) {
            this.selectedItem.selected = false;
            this.selectedItem = null;
        }
    }

    updateSelectedItemStyle(app: VectorDrawingApp) {
        if (!this.selectedItem) return;
        
        if (this.selectedItem.strokeColor !== undefined) {
            this.selectedItem.strokeColor = app.strokeColor;
        }
    }
    
    deleteSelectedItem(app: VectorDrawingApp) {
        if (!this.selectedItem) return;
        
        const index = app.shapes.indexOf(this.selectedItem);
        if (index !== -1) {
            app.shapes.splice(index, 1);
        }
        
        this.selectedItem.remove();
        this.selectedItem = null;
    }
}

/**
 * Need to change so that can't grab grid lines
 * @param app 
 */
export function setupSelectTool(app: VectorDrawingApp) {
    const selectTool = new SelectTool();
    app.selectTool = selectTool;

    selectTool.onMouseDown = function(event) {
        selectTool.unselectSelectedItem();
        
        const hitResult = paper.project.hitTest(event.point, {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        });
        
        if (hitResult && app.gridGroup.children.indexOf(hitResult.item) === -1) {
            selectTool.selectedItem = hitResult.item;
            selectTool.selectedItem.selected = true;
        }
    };
    
    selectTool.onMouseDrag = function(event) {
        if (selectTool.selectedItem) {
            selectTool.selectedItem.position = selectTool.selectedItem.position.add(event.delta);
        }
    };

    selectTool.onKeyDown = function(event) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            selectTool.deleteSelectedItem(app);
            event.preventDefault();
        }
        
        if (event.key === 'Escape') {
            selectTool.unselectSelectedItem();
            event.preventDefault();
        }
    }
}