import { setupCoordinateSystem } from "../inits/setupCoordinateSystem";
import VectorDrawingApp from "../VectorDrawingApp";

export function setupHandTool(app: VectorDrawingApp) {
    app.handTool = new paper.Tool();
    app.handTool.onMouseDown = function(event) {
        app.lastPoint = event.point.clone();
    };
    
    app.handTool.onMouseDrag = function(event) {
        if (app.lastPoint) {
            const delta = event.point.subtract(app.lastPoint);
            
            paper.view.center = paper.view.center.subtract(delta);
            
            setupCoordinateSystem(app);
            
            app.lastPoint = event.point.clone();
        }
    };
    
    app.handTool.onMouseUp = function() {
        app.lastPoint = null;
    };
}