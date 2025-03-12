
class VectorDrawingApp {
    constructor() {
        
        this.currentTool = null;
        this.currentToolName = 'point';
        this.selectedItem = null;
        this.shapes = [];
        
        this.strokeColor = '#000000';
        this.strokeWidth = 2; 
        this.pointSize = 4;
        

        this.gridSize = 20;
        this.showGrid = true;
        this.snapEnabled = false;
        
        paper.setup('drawing-canvas');
        

        this.gridGroup = new paper.Group();
        this.shapesGroup = new paper.Group();
        

        this.setupCoordinateSystem();
        

        this.initializeTools();
        
        this.setupKeyboardShortcuts();
        
        this.addEventListeners();
        
        this.activateTool('point');
    }
    
    setupCoordinateSystem() {
        const view = paper.view;
        
        this.gridGroup.removeChildren();
        
        if (this.showGrid) {
            const gridSize = this.gridSize;
            
            const startX = Math.floor(view.bounds.left / gridSize) * gridSize;
            const endX = Math.ceil(view.bounds.right / gridSize) * gridSize;
            const startY = Math.floor(view.bounds.top / gridSize) * gridSize;
            const endY = Math.ceil(view.bounds.bottom / gridSize) * gridSize;
            
            for (let x = startX; x <= endX; x += gridSize) {
                const line = new paper.Path.Line(
                    new paper.Point(x, view.bounds.top),
                    new paper.Point(x, view.bounds.bottom)
                );
                line.strokeColor = '#e0e0e0';
                line.strokeWidth = 0.5;
                this.gridGroup.addChild(line);
            }
            
            for (let y = startY; y <= endY; y += gridSize) {
                const line = new paper.Path.Line(
                    new paper.Point(view.bounds.left, y),
                    new paper.Point(view.bounds.right, y)
                );
                line.strokeColor = '#e0e0e0';
                line.strokeWidth = 0.5;
                this.gridGroup.addChild(line);
            }
        }
        
        this.gridGroup.sendToBack();
    }
    
    createPoint(position) {
        const point = new paper.Path.Circle({
            center: position,
            radius: this.pointSize,
            fillColor: '#ffffff',
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            data: {
                type: 'point'
            }
        });
        
        this.shapesGroup.addChild(point);
        this.shapes.push(point);
        
        return point;
    }
    
    createLine(startPoint, endPoint) {
        const line = new paper.Path.Line({
            from: startPoint,
            to: endPoint,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            data: {
                type: 'line'
            }
        });
        
        this.shapesGroup.addChild(line);
        this.shapes.push(line);
        
        return line;
    }
    
    initializeTools() {
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
                let selectedItem = hitResult.item;
                
                if (selectedItem.parent && selectedItem.parent.data && 
                    selectedItem.parent.data.type === 'pointGroup') {
                    selectedItem = selectedItem.parent;
                }
                
                that.selectedItem = selectedItem;
                that.selectedItem.selected = true;
                
                that.updatePropertiesPanel();
            }
        };
        
        this.selectTool.onMouseDrag = function(event) {
            if (that.selectedItem) {
                that.selectedItem.position = that.selectedItem.position.add(event.delta);
                
                if (that.selectedItem.data && that.selectedItem.data.type === 'pointGroup') {
                    const point = that.selectedItem.data.point;
                    const position = point.position;
                    point.data.coordinates = [position.x, position.y, 0];
                    
                    const label = that.selectedItem.data.label;
                    if (label) {
                        label.content = `(${Math.round(position.x)},${Math.round(position.y)})`;
                    }
                }
                else if (that.selectedItem.data && that.selectedItem.data.type === 'line') {
                    const line = that.selectedItem;
                    line.data.startCoordinates = [line.firstSegment.point.x, line.firstSegment.point.y, 0];
                    line.data.endCoordinates = [line.lastSegment.point.x, line.lastSegment.point.y, 0];
                }
            }
        };
        
        this.pointTool = new paper.Tool();
        this.pointTool.onMouseDown = function(event) {
            that.createPoint(event.point);
        };
        
        this.lineTool = new paper.Tool();
        this.lineTool.onMouseDown = function(event) {
            that.lineStart = event.point;
            that.currentPath = new paper.Path();
            that.currentPath.strokeColor = that.strokeColor;
            that.currentPath.strokeWidth = that.strokeWidth;
            that.currentPath.add(that.lineStart);
        };
        
        this.lineTool.onMouseDrag = function(event) {
            if (that.currentPath.segments.length > 1) {
                that.currentPath.removeSegments(1);
            }
            
            that.currentPath.add(event.point);
        };
        
        this.lineTool.onMouseUp = function(event) {
            that.createLine(that.lineStart, event.point);
            
            that.currentPath.remove();
            that.currentPath = null;
        };
    }
    
    activateTool(toolName) {
        this.currentToolName = toolName;
        
        switch (toolName) {
            case 'select':
                this.selectTool.activate();
                this.currentTool = this.selectTool;
                document.body.style.cursor = 'default';
                break;
            case 'point':
                this.pointTool.activate();
                this.currentTool = this.pointTool;
                document.body.style.cursor = 'crosshair';
                break;
            case 'line':
                this.lineTool.activate();
                this.currentTool = this.lineTool;
                document.body.style.cursor = 'crosshair';
                break;
            case 'hand':
                this.handTool.activate();
                this.currentTool = this.handTool;
                document.body.style.cursor = 'grab';
                break;
        }
        
        this.updateToolUI(toolName);
    }
    
    updateToolUI(toolName) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const toolBtn = document.getElementById(`${toolName}-tool`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }
    }
    
    updatePropertiesPanel() {
    }
    
    addEventListeners() {
        document.getElementById('select-tool').addEventListener('click', () => this.activateTool('select'));
        document.getElementById('point-tool').addEventListener('click', () => this.activateTool('point'));
        document.getElementById('line-tool').addEventListener('click', () => this.activateTool('line'));
        document.getElementById('hand-tool').addEventListener('click', () => this.activateTool('hand'));
        
        const strokeColorInput = document.getElementById('stroke-color');
        if (strokeColorInput) {
            strokeColorInput.addEventListener('input', () => {
                this.strokeColor = strokeColorInput.value;
                this.updateSelectedItemStyle();
            });
        }
        
        const toggleGridBtn = document.getElementById('toggle-grid');
        if (toggleGridBtn) {
            toggleGridBtn.addEventListener('click', () => {
                this.showGrid = !this.showGrid;
                this.setupCoordinateSystem();
                toggleGridBtn.textContent = this.showGrid ? 'Hide Grid' : 'Show Grid';
            });
        }
        
        const toggleSnapBtn = document.getElementById('toggle-snap');
        if (toggleSnapBtn) {
            toggleSnapBtn.addEventListener('click', () => {
                this.toggleSnapToGrid();
            });
        }
        
        const deleteBtn = document.getElementById('delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteSelectedItem());
        }
        
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCanvas());
        }
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.setupCoordinateSystem(), 100);
        });
    }
    
    updateSelectedItemStyle() {
        if (!this.selectedItem) return;
        
        if (this.selectedItem.strokeColor !== undefined) {
            this.selectedItem.strokeColor = this.strokeColor;
        }
    }
    
    deleteSelectedItem() {
        if (!this.selectedItem) return;
        
        const index = this.shapes.indexOf(this.selectedItem);
        if (index !== -1) {
            this.shapes.splice(index, 1);
        }
        
        this.selectedItem.remove();
        this.selectedItem = null;
    }
    
    clearCanvas() {
        this.shapesGroup.removeChildren();
        this.shapes = [];
        this.selectedItem = null;
        
        this.setupCoordinateSystem();
    }
    
    exportShapesData() {
        const shapesData = [];
        
        this.shapes.forEach(shape => {
            if (shape.data) {
                if (shape.data.type === 'point') {
                    shapesData.push({
                        type: 'point',
                        coordinates: shape.data.coordinates
                    });
                }
                else if (shape.data.type === 'line') {
                    shapesData.push({
                        type: 'line',
                        startCoordinates: shape.data.startCoordinates,
                        endCoordinates: shape.data.endCoordinates
                    });
                }
            }
        });
        
        return shapesData;
    }

    setupPanAndZoom() {
        const that = this;
        let lastPoint = null;
        let isPanning = false;
        
        this.panTool = new paper.Tool();
        
        this.panTool.onMouseDown = function(event) {
            if (that.isPanMode) {
                lastPoint = event.point.clone();
                isPanning = true;
            }
        };
        
        this.panTool.onMouseDrag = function(event) {
            if (isPanning && lastPoint) {
                const delta = event.point.subtract(lastPoint);
                
                paper.view.center = paper.view.center.subtract(delta);
                
                that.setupCoordinateSystem();
                
                lastPoint = event.point.clone();
            }
        };
        
        this.panTool.onMouseUp = function() {
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
            
            that.setupCoordinateSystem();
            
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
                that.activateTool(that.currentToolName);
                document.body.style.cursor = 'default';
            }
        });
    }
    
    snapToGrid(point) {
        if (!this.snapEnabled) return point;
        
        const x = Math.round(point.x / this.gridSize) * this.gridSize;
        const y = Math.round(point.y / this.gridSize) * this.gridSize;
        
        return new paper.Point(x, y);
    }
    
    toggleSnapToGrid() {
        this.snapEnabled = !this.snapEnabled;
        const snapBtn = document.getElementById('toggle-snap');
        if (snapBtn) {
            snapBtn.textContent = this.snapEnabled ? 'Snap: ON' : 'Snap: OFF';
        }
    }
    
    createPoint(position) {
        if (this.snapEnabled) {
            position = this.snapToGrid(position);
        }
        
        const point = new paper.Path.Circle({
            center: position,
            radius: this.pointSize,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            data: {
                type: 'point',
                coordinates: [position.x, position.y, 0]
            }
        });
        
        this.shapesGroup.addChild(point);
        this.shapes.push(point);
        
        if (this.showCoordinates) {
            const coordText = new paper.PointText({
                point: new paper.Point(position.x + this.pointSize + 2, position.y - this.pointSize),
                content: `(${Math.round(position.x)},${Math.round(position.y)})`,
                fontSize: 10,
                fillColor: '#000000',
                data: {
                    type: 'label',
                    parent: point,
                    isCoordinateLabel: true
                }
            });
            this.shapesGroup.addChild(coordText);
            
            const group = new paper.Group([point, coordText]);
            group.data = {
                type: 'pointGroup',
                point: point,
                label: coordText
            };
        }
        
        return point;
    }
    
    initializeTools() {
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
    
    setupKeyboardShortcuts() {
        const that = this;
        
        document.addEventListener('keydown', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (event.key === 'Delete' || event.key === 'Backspace') {
                that.deleteSelectedItem();
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
}

document.addEventListener('DOMContentLoaded', function() {
    const app = new VectorDrawingApp();
    
    window.vectorApp = app;
});