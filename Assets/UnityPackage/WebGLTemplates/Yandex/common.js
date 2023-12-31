const canvas = document.querySelector("#unity-canvas");

let unityInstance = null;

function RestoreFocus() {
    window.focus();
    canvas.focus();
}

window.addEventListener('pointerdown', () => {
    RestoreFocus();
});
window.addEventListener('touchstart', () => {
    RestoreFocus();
});