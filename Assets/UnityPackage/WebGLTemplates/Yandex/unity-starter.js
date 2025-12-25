const config = {
    dataUrl: "Build/{{{ DATA_FILENAME }}}",
    frameworkUrl: "Build/{{{ FRAMEWORK_FILENAME }}}",
#if USE_THREADS
    workerUrl: "Build/{{{ WORKER_FILENAME }}}",
#endif
#if USE_WASM
    codeUrl: "Build/{{{ CODE_FILENAME }}}",
#endif
#if MEMORY_FILENAME
    memoryUrl: "Build/{{{ MEMORY_FILENAME }}}",
#endif
#if SYMBOLS_FILENAME
    symbolsUrl: "Build/{{{ SYMBOLS_FILENAME }}}",
#endif
    streamingAssetsUrl: "StreamingAssets",
    companyName: {{{ JSON.stringify(COMPANY_NAME) }}},
    productName: {{{ JSON.stringify(PRODUCT_NAME) }}},
    productVersion: {{{ JSON.stringify(PRODUCT_VERSION) }}},
    // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
};

let builtInAlert = alert;
alert = function(message) {
    if (message != null && typeof(message) == "string") {
        if (message.indexOf("AbortError: Fetch is aborted") !== -1) {
            console.log("Suppressed exception: \"AbortError: Fetch is aborted\"");
            return;
        }
    }
    builtInAlert(message);
}

function InitializeYandexGamesSDK() {
    window.YGPsdk = null;
    return new Promise((resolve, reject) => {
        YaGames
            .init()
            .then(sdk => {
                window.YGPsdk = sdk;
                resolve();
            })
            .catch(error => {
                console.log("YandexGamesSDK initialization failed", error);
                reject();
            });
    });
}

async function BootstrapGame() {
    await InitializeYandexGamesSDK();
    if (window.YGPsdk != null) {
        YGPsdk.adv.showFullscreenAdv({
            callbacks:{
                onClose: function(wasShown) { },
                onOpen: function() { },
                onError: function(error) { },
                onOffline: function() { },
            }
        });
    }
    createUnityInstance(canvas, config, (progress) => {
        loadingSpinner.style.display = "none";
        loadingBar.style.display = "";
        loadingBarFiller.style.width = `${100 * Math.max(progress, 0.05)}%`;
    }).then(createdInstance => {
        unityInstance = createdInstance;
        loadingOverlay.style.background = "";
        loadingOverlay.style.display = "none";
    }).catch(error => {
        console.error("Failed to start UnityInstance: " + error)
        document.body.innerHTML = "<div id=\"error-overlay\"><span>" + error + "</span></div>";
    });
}

BootstrapGame();