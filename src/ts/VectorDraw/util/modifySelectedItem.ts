import VectorDrawingApp from "../VectorDrawingApp";

export function updateSelectedItemStyle(app: VectorDrawingApp) {
    if (!app.selectedItem) return;
    
    if (app.selectedItem.strokeColor !== undefined) {
        app.selectedItem.strokeColor = app.strokeColor;
    }
}

export function deleteSelectedItem(app: VectorDrawingApp) {
    if (!app.selectedItem) return;
    
    const index = app.shapes.indexOf(app.selectedItem);
    if (index !== -1) {
        app.shapes.splice(index, 1);
    }
    
    app.selectedItem.remove();
    app.selectedItem = null;
}