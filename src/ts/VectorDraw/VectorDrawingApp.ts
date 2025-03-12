import { setupCoordinateSystem } from './inits/setupCoordinateSystem';
import { addEventListeners } from './inits/addEventListeners';
import { initializeTools } from './inits/initializeTools';
import { activateTool } from './tools/activateTool';
import { setupKeyboardShortcuts } from './inits/setupKeyboardShortcuts';

class VectorDrawingApp {
    currentTool: any;
    currentToolName: string;
    selectedItem: any;
    shapes: paper.Path[];
    strokeColor: string;
    strokeWidth: number;
    pointSize: number;
    gridSize: number;
    showGrid: boolean;
    snapEnabled: boolean;
    gridGroup: any;
    shapesGroup: any;
    showCoordinates: any;
    fillColor: any;
    panTool: any;
    selectTool: paper.Tool | undefined;
    pointTool: paper.Tool | undefined;
    lineTool: paper.Tool | undefined;
    lineStart: paper.Point | null | undefined;
    currentPath: paper.Path | null | undefined;
    lastPoint: paper.Point | null | undefined;
    handTool: paper.Tool | undefined;
    isPanMode: boolean;

    constructor() {
        
        this.currentTool = null;
        this.currentToolName = 'point';
        this.selectedItem = null;
        this.shapes = [];
        
        this.strokeColor = '#000000';
        this.strokeWidth = 2; 
        this.pointSize = 4;

        this.isPanMode = false;

        this.gridSize = 20;
        this.showGrid = true;
        this.snapEnabled = false;
        
        paper.setup('drawing-canvas');
        

        this.gridGroup = new paper.Group();
        this.shapesGroup = new paper.Group();

        // ---------------------

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