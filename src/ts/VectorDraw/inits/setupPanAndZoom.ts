import { activateTool } from "../tools/activateTool";
import VectorDrawingApp from "../VectorDrawingApp";
import { setupCoordinateSystem } from "./setupCoordinateSystem";

export function setupPanAndZoom(app: VectorDrawingApp) {
    const that = app;
    let lastPoint: paper.Point | null = null;
    let isPanning = false;
    
    app.panTool = new paper.Tool();
    
    app.panTool.onMouseDown = function(event: any) {
        if (that.isPanMode) {
            lastPoint = event.point.clone();
            isPanning = true;
        }
    };
    
    app.panTool.onMouseDrag = function(event: any) {
        if (isPanning && lastPoint) {
            const delta = event.point.subtract(lastPoint);
            
            paper.view.center = paper.view.center.subtract(delta);
            
            setupCoordinateSystem(that);
            
            lastPoint = event.point.clone();
        }
    };
    
    app.panTool.onMouseUp = function() {
        isPanning = false;
        lastPoint = null;
    };
    
    paper.view.element.addEventListener('wheel', function(event) {
        event.preventDefault();
        
        const mousePosition = new paper.Point(
            event.offsetX,
            event.offsetY
        );
        
        const viewPosition = paper.view.viewToProject(mousePosition);
        
        const zoomFactor = 1 + (event.deltaY > 0 ? -0.1 : 0.1);
        
        const newZoom = paper.view.zoom * zoomFactor;
        if (newZoom < 0.1 || newZoom > 10) return;
        
        paper.view.zoom = newZoom;
        
        const centerAdjustment = viewPosition.subtract(paper.view.center);
        const newCenter = paper.view.center.add(centerAdjustment.subtract(
            centerAdjustment.multiply(zoomFactor)
        ));
        paper.view.center = newCenter;
        
        setupCoordinateSystem(that);
        
        const statusElement = document.getElementById('app-status');
        if (statusElement) {
            statusElement.textContent = `Zoom: ${Math.round(paper.view.zoom * 100)}%`;
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            that.isPanMode = true;
            that.panTool.activate();
            document.body.style.cursor = 'grab';
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.code === 'Space') {
            that.isPanMode = false;
            activateTool(that, that.currentToolName);
            document.body.style.cursor = 'default';
        }
    });
}