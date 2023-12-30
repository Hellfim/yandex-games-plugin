var yandexBridgeLibrary = {
    $YGP: {
        ysdk: null,
        unityListenerName: null,
        sendUnityMessage: function (methodName, params) {
            unityInstance.SendMessage(YGP.unityListenerName, methodName, params);
        },
    },
    
    Initialize: function (listenerName) {
        YGP.unityListenerName = UTF8ToString(listenerName);
        YaGames
            .init()
            .then(sdk => {
                YGP.ysdk = sdk;
                console.log("[YandexGamesBridge]: YandexGamesSDK initialized");
                YGP.sendUnityMessage("OnSdkSuccessfullyInitialized");
            })
            .catch(exception => {
                console.error("[YandexGamesBridge]: " + exception);
                YGP.sendUnityMessage("OnSdkInitializationFailure");
            });
    },
    
    SubmitGameReady: function () {
        if (YGP.ysdk !== null && YGP.ysdk.features.LoadingAPI !== 'undefined' && YGP.ysdk.features.LoadingAPI !== null) {
            YGP.ysdk.features.LoadingAPI.ready();
        }
        else {
            console.error("[YandexGamesBridge]: SDK is not initialized or 'ready' feature is unavailable");
        }
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);