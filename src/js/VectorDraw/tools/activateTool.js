export function activateTool(toolName) {
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