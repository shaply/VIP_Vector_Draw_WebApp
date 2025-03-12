export function initializeTools() {
    const that = this;
    
    this.selectTool = new paper.Tool();
    this.selectTool.onMouseDown = function(event) {
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
    
    this.selectTool.onMouseDrag = function(event) {
        if (that.selectedItem) {
            that.selectedItem.position = that.selectedItem.position.add(event.delta);
        }
    };
    
    this.pointTool = new paper.Tool();
    this.pointTool.onMouseDown = function(event) {
        let position = event.point;
        if (that.snapEnabled) {
            position = that.snapToGrid(position);
        }
        that.createPoint(position);
    };
    
    this.lineTool = new paper.Tool();
    this.lineTool.onMouseDown = function(event) {
        let startPoint = event.point;
        if (that.snapEnabled) {
            startPoint = that.snapToGrid(startPoint);
        }
        that.lineStart = startPoint;
        that.currentPath = new paper.Path();
        that.currentPath.strokeColor = that.strokeColor;
        that.currentPath.strokeWidth = that.strokeWidth;
        that.currentPath.add(that.lineStart);
    };
    
    this.lineTool.onMouseDrag = function(event) {
        let currentPoint = event.point;
        if (that.snapEnabled) {
            currentPoint = that.snapToGrid(currentPoint);
        }
        
        if (that.currentPath.segments.length > 1) {
            that.currentPath.removeSegments(1);
        }
        
        that.currentPath.add(currentPoint);
    };
    
    this.lineTool.onMouseUp = function(event) {
        let endPoint = event.point;
        if (that.snapEnabled) {
            endPoint = that.snapToGrid(endPoint);
        }
        
        that.createLine(that.lineStart, endPoint);
        
        that.currentPath.remove();
        that.currentPath = null;
    };
    
    this.handTool = new paper.Tool();
    this.handTool.onMouseDown = function(event) {
        that.lastPoint = event.point.clone();
    };
    
    this.handTool.onMouseDrag = function(event) {
        if (that.lastPoint) {
            const delta = event.point.subtract(that.lastPoint);
            
            paper.view.center = paper.view.center.subtract(delta);
            
            that.setupCoordinateSystem();
            
            that.lastPoint = event.point.clone();
        }
    };
    
    this.handTool.onMouseUp = function() {
        that.lastPoint = null;
    };
}