const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");
const loadingOverlay = document.querySelector("#loading-overlay");
const loadingSpinner = document.querySelector('.loading-progress-spinner');
const loadingBar = document.querySelector("#loading-progress-bar");
const loadingBarFiller = document.querySelector("#loading-progress-bar-filler");

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