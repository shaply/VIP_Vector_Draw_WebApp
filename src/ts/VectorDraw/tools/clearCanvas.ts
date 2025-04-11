import { setupCoordinateSystem } from "../inits/setupCoordinateSystem";
import VectorDrawingApp from "../VectorDrawingApp";

export function clearCanvas(app: VectorDrawingApp) {
    app.shapesGroup.removeChildren();
    app.shapes = [];
    
    setupCoordinateSystem(app);
}