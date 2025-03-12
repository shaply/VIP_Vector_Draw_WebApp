import VectorDrawingApp from './VectorDraw/VectorDrawingApp';

declare global {
    interface Window {
        vectorApp: VectorDrawingApp;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const app = new VectorDrawingApp();
    
    window.vectorApp = app;
});