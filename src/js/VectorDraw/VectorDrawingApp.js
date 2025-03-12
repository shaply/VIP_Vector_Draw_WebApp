import { setupCoordinateSystem } from './inits/setupCoordinateSystem.js';
import { addEventListeners } from './inits/addEventListeners.js';
import { snapToGrid, toggleSnapToGrid } from './util/snapToGridUtils.js';
import { createPoint } from './tools/point.js';
import { createLine } from './tools/line.js';
import { initializeTools } from './inits/initializeTools.js';
import { activateTool } from './tools/activateTool.js';

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
        
        // Bind methods
        this.setupCoordinateSystem = setupCoordinateSystem.bind(this);
        this.initializeTools = initializeTools.bind(this);
        this.addEventListeners = addEventListeners.bind(this);
        this.snapToGrid = snapToGrid.bind(this);
        this.toggleSnapToGrid = toggleSnapToGrid.bind(this);
        this.createPoint = createPoint.bind(this);
        this.createLine = createLine.bind(this);
        this.activateTool = activateTool.bind(this);

        // ---------------------

        this.setupCoordinateSystem();

        this.initializeTools();
        
        this.setupKeyboardShortcuts();
        
        this.addEventListeners();
        
        this.activateTool('point');
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

export default VectorDrawingApp;