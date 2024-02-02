function updateCanvasSize() {
    canvas.style.height = "100%";
    canvas.style.width = "100%";
}

updateCanvasSize();

window.onresize = updateCanvasSize;