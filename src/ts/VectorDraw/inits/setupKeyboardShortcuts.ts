import { deleteSelectedItem } from "../util/modifySelectedItem";
import VectorDrawingApp from "../VectorDrawingApp";

export function setupKeyboardShortcuts(app: VectorDrawingApp) {
    const that = app;
    
    document.addEventListener('keydown', function(event: any) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (event.key === 'Delete' || event.key === 'Backspace') {
            deleteSelectedItem(that);
            event.preventDefault();
        }
        
        if (event.key === 'Escape') {
            if (that.selectedItem) {
                that.selectedItem.selected = false;
                that.selectedItem = null;
            }
            event.preventDefault();
        }
    });
}