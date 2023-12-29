var yandexBridgeLibrary = {
    //InitializationResult.Undefined: 0
    //InitializationResult.Success: 1
    //InitializationResult.Failure: 2
        
    $YGP: {
        ysdk: null,
        initializationResult: 0, //InitializationResult.Undefined
    },
    
    Initialize: function (params) {
        YaGames
            .init(params)
            .then(sdk => {
                YGP.ysdk = sdk;
                YGP.initializationResult = 1; //InitializationResult.Success
                console.log("[YandexGamesBridge]: YandexGamesSDK initialized");
            })
            .catch(exception => {
                YGP.initializationResult = 2; //InitializationResult.Failure
                console.error("[YandexGamesBridge]: " + exception);
            });
    },
    
    GetInitializationResult: function () {
        return YGP.initializationResult;
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