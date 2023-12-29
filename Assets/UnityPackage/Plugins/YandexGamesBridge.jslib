var yandexBridgeLibrary = {
    $YGP: {
        ysdk: null,
    },
    
    Initialize: function (params) {
        YaGames
            .init(params)
            .then(sdk => {
                YGP.ysdk = sdk;
                console.log("YandexGamesSDK initialized");
            })
            .catch(console.error);
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);