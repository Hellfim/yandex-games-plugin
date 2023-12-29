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
                console.log("YandexGamesSDK initialized");
            })
            .catch(exception => {
                YGP.initializationResult = 2; //InitializationResult.Failure
                console.error(exception);
            });
    },
    
    GetInitializationResult: function () {
        return YGP.initializationResult;
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);