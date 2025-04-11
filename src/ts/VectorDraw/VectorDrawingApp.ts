import { setupCoordinateSystem } from './inits/setupCoordinateSystem';
import { addEventListeners } from './inits/addEventListeners';
import { initializeTools } from './inits/initializeTools';
import { activateTool } from './tools/activateTool';
import { setupKeyboardShortcuts } from './inits/setupKeyboardShortcuts';
import { SnapOptions } from './util/snapUtils';
import { CustomTool } from './types/tool';
import { SelectTool } from './tools/select';
import { PointTool } from './tools/point';
import { LineTool } from './tools/line';
import { CircleTool } from './tools/circle';
import { HandTool } from './tools/hand';

class VectorDrawingApp {
    currentTool: CustomTool | null;
    currentToolName: string;
    shapes: paper.Path[]; // Has all the shapes on the grid
    strokeColor: string;
    strokeWidth: number;
    pointSize: number;
    gridSize: number;
    showGrid: boolean;

    snapOptions: SnapOptions;

    gridGroup: paper.Group; // Contains all the grid lines
    shapesGroup: paper.Group; // Contains all the shapes
    showCoordinates: any;
    fillColor: any;
    panTool: any;

    selectTool: SelectTool;
    pointTool: PointTool;
    lineTool: LineTool;
    circleTool: CircleTool;
    handTool: HandTool;

    isPanMode: boolean;

    constructor() {
        
        this.currentTool = null;
        this.currentToolName = 'point';
        this.shapes = [];
        
        this.strokeColor = '#000000';
        this.strokeWidth = 2; 
        this.fillColor = '#000000';
        this.pointSize = 3;

        this.isPanMode = false;

        this.gridSize = 20;
        this.showGrid = true;
        
        this.snapOptions = {
            snapToGrid: false,
            snapToPoint: false,
            snapToLine: false
        }

        paper.setup('drawing-canvas');
        

        this.gridGroup = new paper.Group();
        this.shapesGroup = new paper.Group();

        setupCoordinateSystem(this);

        this.selectTool = new SelectTool();
        this.pointTool = new PointTool();
        this.lineTool = new LineTool();
        this.circleTool = new CircleTool();
        this.handTool = new HandTool();
        initializeTools(this);
        
        setupKeyboardShortcuts(this);
        
        addEventListeners(this);
        
        activateTool(this, 'point');

        console.log('App initialized');
    }
    
    updatePropertiesPanel() {
    }
}

export default VectorDrawingApp;