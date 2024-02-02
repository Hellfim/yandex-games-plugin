function updateCanvasSize() {
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const targetAspectRatio = 390/844;
    if ((vw/vh) > targetAspectRatio * 2) {
        canvas.style.height = "100%";
        canvas.style.width = vh * (targetAspectRatio) + "px";
    }
    else {
        canvas.style.height = "100%";
        canvas.style.width = "100%";
    }
}

updateCanvasSize();

window.onresize = updateCanvasSize;