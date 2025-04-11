import VectorDrawingApp from "../VectorDrawingApp";

export function setupKeyboardShortcuts(app: VectorDrawingApp) {
    const that = app;
    
    document.addEventListener('keydown', function(event: any) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
    });
}