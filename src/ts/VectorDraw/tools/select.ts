import VectorDrawingApp from "../VectorDrawingApp";

/**
 * Need to change so that can't grab grid lines
 * @param app 
 */
export function setupSelectTool(app: VectorDrawingApp) {
    app.selectTool = new paper.Tool();
    app.selectTool.onMouseDown = function(event) {
        if (app.selectedItem) {
            app.selectedItem.selected = false;
            app.selectedItem = null;
        }
        
        const hitResult = paper.project.hitTest(event.point, {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        });
        
        if (hitResult && app.gridGroup.children.indexOf(hitResult.item) === -1) {
            app.selectedItem = hitResult.item;
            app.selectedItem.selected = true;
        }
    };
    
    app.selectTool.onMouseDrag = function(event) {
        if (app.selectedItem) {
            app.selectedItem.position = app.selectedItem.position.add(event.delta);
        }
    };
}