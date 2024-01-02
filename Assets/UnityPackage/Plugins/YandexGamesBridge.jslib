var yandexBridgeLibrary = {
    $YGP: {
        ysdk: null,
        player: null,
        iapClient: null,
        leaderboardsModule: null,
        unityListenerName: null,
        logMessage: function (message) {
            console.log("[YandexGamesBridge]: " + message);
        },
        logError: function (message, error) {
            if (error) {
                console.error("[YandexGamesBridge]: " + message + "| error: [" + error.name + ", " + error.message + "]");
            }
            else {
                console.error("[YandexGamesBridge]: " + message);
            }
        },
        initializePlayer: function () {
            return YGP.ysdk.getPlayer()
                       .then(player => {
                           YGP.player = player;
                           return player;
                       });
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
                YGP.logError("SDK initialization failed", error);
                YGP.sendUnityMessage("OnSdkInitializationFailure");
            });
    },
    
    SubmitGameReady: function () {
        if (YGP.ysdk !== null && typeof (YGP.ysdk.features.LoadingAPI) !== "undefined" && YGP.ysdk.features.LoadingAPI !== null) {
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
                        YGP.logError("RewardedVideoAd failed to display", error);
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
    
    InitializeIAPClient: function () {
        try {
            YGP.ysdk.getPayments()
                .then(iapClient => {
                    YGP.logMessage("IAPs client initialized");
                    YGP.iapClient = iapClient;
                    YGP.sendUnityMessage("OnIAPClientInitialized");
                })
                .catch(error => {
                    YGP.logError("Failed to initialize IAP client", error);
                    YGP.sendUnityMessage("OnIAPClientInitializationFailed", "[" + error.name + ", " + error.message + "]");
                })
        }
        catch (error) {
            YGP.logError("Failed to initialize IAP client", error);
            YGP.sendUnityMessage("OnIAPClientInitializationFailed", "[" + error.name + ", " + error.message + "]");
        }
    },
    
    LoadIAPProducts: function () {
        try {
            YGP.iapClient.getCatalog()
                .then(products => {
                    let productsMetadata = [];
                    for (let i = 0; i < products.length; ++i) {
                        productsMetadata[i] = {
                            Id: products[i].id,
                            Title: products[i].title,
                            Description: products[i].description,
                            Price: products[i].price,
                            PriceValue: products[i].priceValue,
                            PriceCurrencyCode: products[i].priceCurrencyCode,
                        }
                    }
                    
                    YGP.sendUnityMessage("OnIAPProductsLoaded", JSON.stringify(productsMetadata));
                });
        }
        catch (error) {
            YGP.logError("Failed to load products", error);
        }
    },
    
    PurchaseProduct: function (productIdPointer) {
        let id = UTF8ToString(productIdPointer);
        try {
            YGP.iapClient.purchase(id)
                .then(purchase => {
                    YGP.logMessage("Successfully purchased " + id);
                    YGP.sendUnityMessage("OnProductPurchased", purchase.productID);
                    RestoreFocus();
                })
                .catch(error => {
                    YGP.logError("Failed to purchase " + id, error);
                    YGP.sendUnityMessage("OnProductPurchaseFailed", id);
                    RestoreFocus();
                })
        }
        catch (error) {
            YGP.logError("Failed to purchase '" + id + "'", error);
            RestoreFocus();
        }
    },
    
    ConsumeProduct: function (productIdPointer) {
        let id = UTF8ToString(productIdPointer);
        try {
            YGP.iapClient.getPurchases()
                .then(purchases => {
                    for (i = 0; i < purchases.length; ++i) {
                        if (purchases[i].productID === id) {
                            YGP.iapClient.consumePurchase(purchases[i].purchaseToken);
                            YGP.logMessage("Product with id '" + id + "' successfully consumed");
                        }
                    }
                });
        }
        catch (error) {
            YGP.logError("Failed to consume product with '" + id + "'", error);
        }
    },
    
    ProcessUnconsumedProducts: function () {
        try {
            YGP.iapClient.getPurchases()
                .then(purchases => {
                    for (i = 0; i < purchases.length; ++i) {
                        if (purchases[i].productID === id) {
                            YGP.logMessage("Found unconsumed product with id '" + id + "', trying to process it once again.");
                            YGP.sendUnityMessage("OnProductPurchased", purchase.productID);                            
                        }
                    }
                });
        }
        catch (error) {
            YGP.logError("Failed to process unconsumed products", error);
        }
    },
    
    AuthenticatePlayer: function () {
        YGP.initializePlayer()
            .then(player => {
                let authenticationStatus = player.getMode();
                YGP.logMessage("Authentication status (mode): '" + authenticationStatus + "'");
                if (authenticationStatus === "lite") { //Unauthenticated
                    YGP.ysdk.auth.openAuthDialog()
                        .then(() => {
                            YGP.initializePlayer()
                                .then(player => {
                                    YGP.logMessage("Player authenticated successfully!");
                                    YGP.sendUnityMessage("OnPlayerAuthenticated");
                                })
                                .catch(error => {
                                    YGP.logError("Failed to authenticate player", error);
                                    YGP.sendUnityMessage("OnPlayerAuthenticationFailed");
                                });
                        })
                        .catch(error => {
                            YGP.logError("Failed to authenticate player", error);
                            YGP.sendUnityMessage("OnPlayerAuthenticationFailed");
                        });
                }
                else {
                    YGP.logMessage("Player authenticated successfully!");
                    YGP.sendUnityMessage("OnPlayerAuthenticated");
                }
            })
            .catch(error => {
                YGP.logError("Failed to authenticate player", error);
                YGP.sendUnityMessage("OnPlayerAuthenticationFailed");
            });
    },
    
    InitializeLeaderboardsModule: function () {
        try {
            YGP.ysdk.getLeaderboards()
                .then(leaderboardsModule => {
                    YGP.leaderboardsModule = leaderboardsModule;
                    YGP.logMessage("Leaderboards initialized");
                })
                .catch(error => {
                    YGP.logError("Failed to initialize leaderboards", error);
                });
        }
        catch (error) {
            YGP.logError("Failed to initialize leaderboards", error);
        }
    },
    
    SubmitLeaderboardScore: function (leaderboardIdPointer, score) {
        let leaderboardId = UTF8ToString(leaderboardIdPointer);
        try {
            YGP.leaderboardsModule.setLeaderboardScore(leaderboardId, score);
            YGP.sendUnityMessage("OnLeaderboardScoreSubmissionSuccess", leaderboardId);
        }
        catch (error) {
            YGP.logError("Failed to submit score '" + score + "' to the leaderboard with id '" + leaderboardId + "'", error);
            YGP.sendUnityMessage("OnLeaderboardScoreSubmissionFailure", leaderboardId);
        }
    },
};
autoAddDeps(yandexBridgeLibrary, '$YGP');
mergeInto(LibraryManager.library, yandexBridgeLibrary);