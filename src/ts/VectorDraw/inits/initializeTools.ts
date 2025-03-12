import { createLine } from "../tools/line";
import { createPoint } from "../tools/point";
import { snapToGrid } from "../util/snapToGridUtils";
import VectorDrawingApp from "../VectorDrawingApp";
import { setupCoordinateSystem } from "./setupCoordinateSystem";

export function initializeTools(app: VectorDrawingApp) {
    const that = app;
    
    app.selectTool = new paper.Tool();
    app.selectTool.onMouseDown = function(event) {
        if (that.selectedItem) {
            that.selectedItem.selected = false;
            that.selectedItem = null;
        }
        
        const hitResult = paper.project.hitTest(event.point, {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        });
        
        if (hitResult) {
            that.selectedItem = hitResult.item;
            that.selectedItem.selected = true;
        }
    };
    
    app.selectTool.onMouseDrag = function(event) {
        if (that.selectedItem) {
            that.selectedItem.position = that.selectedItem.position.add(event.delta);
        }
    };
    
    app.pointTool = new paper.Tool();
    app.pointTool.onMouseDown = function(event) {
        let position = event.point;
        if (that.snapEnabled) {
            position = snapToGrid(that, position);
        }
        createPoint(that, position);
    };
    
    app.lineTool = new paper.Tool();
    app.lineTool.onMouseDown = function(event) {
        let startPoint = event.point;
        if (that.snapEnabled) {
            startPoint = snapToGrid(that, startPoint);
        }
        that.lineStart = startPoint;
        that.currentPath = new paper.Path();
        that.currentPath.strokeColor = that.strokeColor;
        that.currentPath.strokeWidth = that.strokeWidth;
        that.currentPath.add(that.lineStart);
    };
    
    app.lineTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        if (that.snapEnabled) {
            currentPoint = snapToGrid(that, currentPoint);
        }
        
        if (!that.currentPath) { // null or undefined check
            return;
        }

        if (that.currentPath.segments.length > 1) {
            that.currentPath.removeSegments(1);
        }
        
        that.currentPath.add(currentPoint);
    };
    
    app.lineTool.onMouseUp = function(event) {
        let endPoint = event.point;
        if (that.snapEnabled) {
            endPoint = snapToGrid(that, endPoint);
        }
        
        if (!that.lineStart) { // null or undefined check
            return;
        }

        createLine(that, that.lineStart, endPoint);
        
        that.currentPath?.remove();
        that.currentPath = null;
    };
    
    app.handTool = new paper.Tool();
    app.handTool.onMouseDown = function(event) {
        that.lastPoint = event.point.clone();
    };
    
    app.handTool.onMouseDrag = function(event) {
        if (that.lastPoint) {
            const delta = event.point.subtract(that.lastPoint);
            
            paper.view.center = paper.view.center.subtract(delta);
            
            setupCoordinateSystem(that);
            
            that.lastPoint = event.point.clone();
        }
    };
    
    app.handTool.onMouseUp = function() {
        that.lastPoint = null;
    };
}