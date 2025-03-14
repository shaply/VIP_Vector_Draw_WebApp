import { setupCoordinateSystem } from "../inits/setupCoordinateSystem";
import VectorDrawingApp from "../VectorDrawingApp";

/**
 * Sets up functionality for dragging the canvas around. Currently uses a velocity threshold
 * approach to minimize jittering of the canvas when the mouse moves slowly.
 * @param app 
 */
export function setupHandTool(app: VectorDrawingApp) {
    const velocityThreshold = 0.25;

    app.handTool = new paper.Tool();
    app.handTool.onMouseDown = function(event) {
        app.lastPoint = event.point.clone();
        app.lastTime = Date.now();
    };
    
    app.handTool.onMouseDrag = function(event) {
        if (app.lastPoint) {
            const delta = event.point.subtract(app.lastPoint);
            const currentTime = Date.now();
            let timeDelta: number;
            if (!app.lastTime) {
                timeDelta = 0;
            } else {
                timeDelta = currentTime - app.lastTime;
            }
            const velocity = delta.length / timeDelta;
            app.lastTime = currentTime;
            if (velocity < velocityThreshold) {
                app.lastPoint = event.point.clone();
                return;
            }
            
            paper.view.center = paper.view.center.subtract(delta);
            
            setupCoordinateSystem(app);
            
            app.lastPoint = event.point.clone();
        }
    };
    
    app.handTool.onMouseUp = function() {
        app.lastPoint = null;
    };
}