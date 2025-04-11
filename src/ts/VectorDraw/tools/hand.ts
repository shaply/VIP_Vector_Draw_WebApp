import { setupCoordinateSystem } from "../inits/setupCoordinateSystem";
import { CustomTool } from "../types/tool";
import VectorDrawingApp from "../VectorDrawingApp";

export class HandTool extends CustomTool {
    lastPoint: paper.Point | null | undefined;
    lastTime: number | null | undefined;

    deactivate() {
        // Logic to deactivate the tool
    }
}

/**
 * Sets up functionality for dragging the canvas around. Currently uses a velocity threshold
 * approach to minimize jittering of the canvas when the mouse moves slowly.
 * @param app 
 */
export function setupHandTool(app: VectorDrawingApp) {
    const velocityThreshold = 0.25;
    const handTool = new HandTool();
    app.handTool = handTool;

    handTool.onMouseDown = function(event) {
        handTool.lastPoint = event.point.clone();
        handTool.lastTime = Date.now();
    };
    
    handTool.onMouseDrag = function(event) {
        if (handTool.lastPoint) {
            const delta = event.point.subtract(handTool.lastPoint);
            const currentTime = Date.now();
            let timeDelta: number;
            if (!handTool.lastTime) {
                timeDelta = 0;
            } else {
                timeDelta = currentTime - handTool.lastTime;
            }
            const velocity = delta.length / timeDelta;
            handTool.lastTime = currentTime;
            if (velocity < velocityThreshold) {
                handTool.lastPoint = event.point.clone();
                return;
            }
            
            paper.view.center = paper.view.center.subtract(delta);
            
            setupCoordinateSystem(app);
            
            handTool.lastPoint = event.point.clone();
        }
    };
    
    handTool.onMouseUp = function() {
        handTool.lastPoint = null;
    };
}