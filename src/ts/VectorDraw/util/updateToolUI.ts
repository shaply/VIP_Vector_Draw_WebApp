
export function updateToolUI(toolName: string) {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const toolBtn = document.getElementById(`${toolName}-tool`);
    if (toolBtn) {
        toolBtn.classList.add('active');
    }
}