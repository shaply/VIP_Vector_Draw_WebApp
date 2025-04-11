export abstract class CustomTool extends paper.Tool {    
    constructor() {
        super();
    }

    abstract deactivate(): void;
}