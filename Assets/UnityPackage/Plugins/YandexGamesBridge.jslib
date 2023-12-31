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
                console.log("[YandexGamesBridge]: SDK initialized");
                YGP.sendUnityMessage("OnSdkSuccessfullyInitialized");
            })
            .catch(error => {
                console.error("[YandexGamesBridge]: SDK initialization failed with error [" + error.name + ", " + error.message + "]");
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
    
    ShowRewardedVideoAd: function () {
        try {
            YGP.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        console.log("[YandexGamesBridge]: RewardedVideoAd opened");
                        YGP.sendUnityMessage("OnRewardedVideoAdOpened");
                    },
                    onRewarded: () => {
                        console.log("[YandexGamesBridge]: RewardedVideoAd finished");
                        YGP.sendUnityMessage("OnRewardedVideoAdFinished");
                    },
                    onClose: () => {
                        console.log("[YandexGamesBridge]: RewardedVideoAd closed");
                        YGP.sendUnityMessage("OnRewardedVideoAdClosed");
                    },
                    onError: error => {
                        console.error("[YandexGamesBridge]: RewardedVideoAd received error [" + error.name + ", " + error.message + "]");
                        YGP.sendUnityMessage("OnRewardedVideoAdReceivedError");
                    }
                }
            });
        }
        catch (error) {
            console.error("[YandexGamesBridge]: RewardedVideoAd failed to display [" + error.name + ", " + error.message + "]");
            YGP.sendUnityMessage("OnRewardedVideoAdReceivedError");
        }
    },
    
    DisplayBanner: function () {
        try {
            YGP.ysdk.adv.showBannerAdv();
        }
        catch (error) {
            console.error("[YandexGamesBridge]: Banner failed to display [" + error.name + ", " + error.message + "]");
        }
    },
    
    HideBanner: function () {
        try {
            YGP.ysdk.adv.hideBannerAdv();
        }
        catch (error) {
            console.error("[YandexGamesBridge]: Banner failed to hide [" + error.name + ", " + error.message + "]");
        }
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);