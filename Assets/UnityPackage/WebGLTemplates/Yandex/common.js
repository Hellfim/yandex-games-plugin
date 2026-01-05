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

window.alert = function(message) {
    console.error("[Suppressed Alert] " + message);
};

window.addEventListener("unhandledrejection", function(event) {
    event.preventDefault();
    console.error("[Suppressed Rejection]", event.reason);
});
window.addEventListener("error", function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    console.error("[Suppressed Error]", event.error || event.message);
    return true;
});