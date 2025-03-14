import { setupCoordinateSystem } from './inits/setupCoordinateSystem';
import { addEventListeners } from './inits/addEventListeners';
import { initializeTools } from './inits/initializeTools';
import { activateTool } from './tools/activateTool';
import { setupKeyboardShortcuts } from './inits/setupKeyboardShortcuts';

class VectorDrawingApp {
    currentTool: any;
    currentToolName: string;
    selectedItem: any;
    shapes: paper.Path[]; // Has all the shapes on the grid
    strokeColor: string;
    strokeWidth: number;
    pointSize: number;
    gridSize: number;
    showGrid: boolean;
    snapToPoint: boolean;
    snapToGrid: boolean;
    gridGroup: paper.Group; // Contains all the grid lines
    shapesGroup: paper.Group; // Contains all the shapes
    showCoordinates: any;
    fillColor: any;
    panTool: any;
    selectTool: paper.Tool | undefined;
    pointTool: paper.Tool | undefined;

    lineTool: paper.Tool | undefined;
    lineStart: paper.Point | null | undefined;
    currentPath: paper.Path | null | undefined;
    lastPoint: paper.Point | null | undefined;
    lastTime: number | null | undefined;

    circleTool: paper.Tool | undefined;
    circleStart: paper.Point | null | undefined;
    currentCircle: paper.Path | null | undefined;

    handTool: paper.Tool | undefined;
    isPanMode: boolean;

    constructor() {
        
        this.currentTool = null;
        this.currentToolName = 'point';
        this.selectedItem = null;
        this.shapes = [];
        
        this.strokeColor = '#000000';
        this.strokeWidth = 2; 
        this.fillColor = '#000000';
        this.pointSize = 3;

        this.isPanMode = false;

        this.gridSize = 20;
        this.showGrid = true;
        this.snapToPoint = false;
        this.snapToGrid = false;

        paper.setup('drawing-canvas');
        

        this.gridGroup = new paper.Group();
        this.shapesGroup = new paper.Group();

        setupCoordinateSystem(this);

        initializeTools(this);
        
        setupKeyboardShortcuts(this);
        
        addEventListeners(this);
        
        activateTool(this, 'point');
    }
    
    updatePropertiesPanel() {
    }
}

export default VectorDrawingApp;