var yandexBridgeLibrary = {
    $YGP: {
        ysdk: null,
        unityListenerName: null,
        logMessage: function (message) {
            console.log("[YandexGamesBridge]: " + message);
        },
        logError: function (message, error) {
            if (error) {
                console.error("[YandexGamesBridge]: " + message + " [" + error.name + ", " + error.message + "]");
            }
            else {
                console.error("[YandexGamesBridge]: " + message);
            }
        },
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
                YGP.logMessage("SDK initialized")
                YGP.sendUnityMessage("OnSdkSuccessfullyInitialized");
            })
            .catch(error => {
                YGP.logError("SDK initialization failed with error", error);
                YGP.sendUnityMessage("OnSdkInitializationFailure");
            });
    },
    
    SubmitGameReady: function () {
        if (YGP.ysdk !== null && typeof YGP.ysdk.features.LoadingAPI !== "undefined" && YGP.ysdk.features.LoadingAPI !== null) {
            YGP.ysdk.features.LoadingAPI.ready();
        }
        else {
            YGP.logError("SDK is not initialized or 'ready' feature is unavailable");
        }
    },
    
    ShowRewardedVideoAd: function () {
        try {
            YGP.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        YGP.logMessage("RewardedVideoAd opened");
                        YGP.sendUnityMessage("OnRewardedVideoAdOpened");
                    },
                    onRewarded: () => {
                        YGP.logMessage("RewardedVideoAd finished");
                        YGP.sendUnityMessage("OnRewardedVideoAdFinished");
                    },
                    onClose: () => {
                        YGP.logMessage("RewardedVideoAd closed");
                        YGP.sendUnityMessage("OnRewardedVideoAdClosed");
                    },
                    onError: error => {
                        YGP.logError("RewardedVideoAd received error", error);
                        YGP.sendUnityMessage("OnRewardedVideoAdReceivedError");
                    }
                }
            });
        }
        catch (error) {
            YGP.logError("RewardedVideoAd failed to display", error);
            YGP.sendUnityMessage("OnRewardedVideoAdReceivedError");
        }
    },
    
    DisplayBanner: function () {
        try {
            YGP.ysdk.adv.showBannerAdv();
        }
        catch (error) {
            YGP.logError("Banner failed to display", error);
        }
    },
    
    HideBanner: function () {
        try {
            YGP.ysdk.adv.hideBannerAdv();
        }
        catch (error) {
            YGP.logError("Banner failed to hide", error);
        }
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);