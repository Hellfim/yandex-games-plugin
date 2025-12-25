let YGP = {
    ysdk: null,
    iapModule: null,
    playerAccountModule: null,
    leaderboardsModule: null,
    unityListenerName: null,
    isGameReadySent: false,
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
    getSerializedPurchase: function(purchase) {
        return JSON.stringify({
            ProductId: purchase.productID,
            TransactionId: purchase.purchaseToken
        });
    },
    sendUnityMessage: function (methodName, optionalParameter) { //multiple optional parameters are not supported by Unity's SendMessage
        unityInstance.SendMessage(YGP.unityListenerName, methodName, optionalParameter);
    },
    initialize: function () {
        if (window.YGPsdk == null) {
            YGP.logError("SDK initialization failed", error);
            YGP.sendUnityMessage("OnSdkInitializationFailure");
        }
        else {
            YGP.ysdk = window.YGPsdk;
            YGP.logMessage("SDK initialized")
            YGP.ysdk.getPlayer({scopes: false})
                .then(player => {
                    YGP.playerAccountModule = {
                        isAuthenticated: player.isAuthorized(),
                        player: player
                    };
                    YGP.sendUnityMessage("OnSdkSuccessfullyInitialized");
                })
                .catch(error => {
                    YGP.playerAccountModule = {
                        isAuthenticated: false,
                    };
                    YGP.logError("Failed to correctly initialize player account module", error);
                    YGP.sendUnityMessage("OnSdkInitializationFailure");
                });
        }
    },
    submitGameReady: function () {
        if (YGP.ysdk !== null && typeof (YGP.ysdk.features.LoadingAPI) !== "undefined" && YGP.ysdk.features.LoadingAPI !== null) {
            if (!YGP.isGameReadySent) {
                YGP.ysdk.features.LoadingAPI.ready();
                YGP.isGameReadySent = true;
            }
        }
        else {
            YGP.logError("SDK is not initialized or 'ready' feature is unavailable");
        }
    },
    submitGameplayStart: function () {
        if (YGP.ysdk !== null && typeof (YGP.ysdk.features.GameplayAPI) !== "undefined" && YGP.ysdk.features.GameplayAPI !== null) {
            YGP.ysdk.features.GameplayAPI.start();
        }
        else {
            YGP.logError("SDK is not initialized or 'gameplay start' feature is unavailable");
        }
    },
    submitGameplayStop: function () {
        if (YGP.ysdk !== null && typeof (YGP.ysdk.features.GameplayAPI) !== "undefined" && YGP.ysdk.features.GameplayAPI !== null) {
            YGP.ysdk.features.GameplayAPI.stop();
        }
        else {
            YGP.logError("SDK is not initialized or 'gameplay stop' feature is unavailable");
        }
    },
    showInterstitialAd: function () {
        try {
            YGP.ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onOpen: () => {
                        YGP.logMessage("InterstitialAd opened");
                        YGP.sendUnityMessage("OnInterstitialAdOpened");
                    },
                    onClose: () => {
                        YGP.logMessage("InterstitialAd closed");
                        YGP.sendUnityMessage("OnInterstitialAdClosed");
                    },
                    onError: error => {
                        YGP.logError("InterstitialAd failed to display", error);
                        YGP.sendUnityMessage("OnInterstitialAdReceivedError");
                    }
                }
            });
        }
        catch (error) {
            YGP.logError("RewardedVideoAd failed to display", error);
            YGP.sendUnityMessage("OnRewardedVideoAdReceivedError");
        }
    },
    showRewardedVideoAd: function () {
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
    displayBanner: function () {
        try {
            YGP.ysdk.adv.showBannerAdv();
        }
        catch (error) {
            YGP.logError("Banner failed to display", error);
        }
    },
    hideBanner: function () {
        try {
            YGP.ysdk.adv.hideBannerAdv();
        }
        catch (error) {
            YGP.logError("Banner failed to hide", error);
        }
    },
    initializeIAPModule: function () {
        try {
            YGP.ysdk.getPayments()
                .then(iapModule => {
                    YGP.logMessage("IAPs module initialized");
                    YGP.iapModule = iapModule;
                    YGP.sendUnityMessage("OnIAPModuleInitialized");
                })
                .catch(error => {
                    YGP.logError("Failed to initialize IAP module", error);
                    YGP.sendUnityMessage("OnIAPModuleInitializationFailed", "[" + error.name + ", " + error.message + "]");
                })
        }
        catch (error) {
            YGP.logError("Failed to initialize IAP module", error);
            YGP.sendUnityMessage("OnIAPModuleInitializationFailed", "[" + error.name + ", " + error.message + "]");
        }
    },
    loadIAPProducts: function () {
        try {
            YGP.iapModule.getCatalog()
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
    purchaseProduct: function (productId) {
        try {
            YGP.iapModule.purchase(productId)
                .then(purchase => {
                    YGP.logMessage("Successfully purchased " + productId);
                    YGP.sendUnityMessage("OnProductPurchased", YGP.getSerializedPurchase(purchase));
                    RestoreFocus();
                })
                .catch(error => {
                    YGP.logError("Failed to purchase " + productId, error);
                    YGP.sendUnityMessage("OnProductPurchaseFailed", productId);
                    RestoreFocus();
                })
        }
        catch (error) {
            YGP.logError("Failed to purchase '" + productId + "'", error);
            YGP.sendUnityMessage("OnProductPurchaseFailed", productId);
            RestoreFocus();
        }
    },
    consumeProduct: function (productId) {
        try {
            YGP.iapModule.getPurchases()
                .then(purchases => {
                    for (i = 0; i < purchases.length; ++i) {
                        if (purchases[i].productID === productId) {
                            YGP.iapModule.consumePurchase(purchases[i].purchaseToken);
                            YGP.logMessage("Product with productId '" + productId + "' successfully consumed");
                        }
                    }
                });
        }
        catch (error) {
            YGP.logError("Failed to consume product with '" + productId + "'", error);
        }
    },
    processUnconsumedProducts: function () {
        try {
            YGP.iapModule.getPurchases()
                .then(purchases => {
                    for (i = 0; i < purchases.length; ++i) {
                        YGP.logMessage("Found unconsumed product with id '" + purchases[i].productID + "', trying to process it once again.");
                        YGP.sendUnityMessage("OnProductPurchased", YGP.getSerializedPurchase(purchases[i]));
                    }
                });
        }
        catch (error) {
            YGP.logError("Failed to process unconsumed products", error);
        }
    },
    authenticatePlayer: function () {
        if (YGP.playerAccountModule == null) {
            YGP.logError("Player account module is not initialized")
            YGP.sendUnityMessage("OnPlayerAuthenticationFailed");
            return;
        }

        if (YGP.playerAccountModule.isAuthenticated) {
            YGP.logMessage("Player is already authenticated");
            YGP.sendUnityMessage("OnPlayerAuthenticated");
            return;
        }

        YGP.ysdk.auth.openAuthDialog()
            .then(() => {
                YGP.ysdk.getPlayer({scopes: false})
                    .then(player => {
                        YGP.playerAccountModule = {
                            isAuthenticated: true,
                            player: player
                        };
                        YGP.logMessage("Player authenticated successfully!");
                        YGP.sendUnityMessage("OnPlayerAuthenticated");
                        YGP.loadPlayerCloudData();
                    })
                    .catch(error => {
                        YGP.logError("Failed to authenticate player", error);
                    });
            })
            .catch(error => {
                YGP.logError("Failed to authenticate player", error);
                YGP.sendUnityMessage("OnPlayerAuthenticationFailed");
            });
    },
    loadPlayerCloudData: function() {
        if (this.playerAccountModule == null || this.playerAccountModule.player == null) {
            this.logError("Player account module is not initialized")
            this.sendUnityMessage("OnPlayerCloudDataLoaded", "LoadingError");
            return;
        }

        this.playerAccountModule.player
            .getData(["playerData"])
            .then(data => {
                this.sendUnityMessage("OnPlayerCloudDataLoaded", data.playerData == null ? JSON.stringify({}) : data.playerData);
            })
            .catch(error => {
                this.logError("Failed to load cloud data", error);
                this.sendUnityMessage("OnPlayerCloudDataLoaded", "LoadingError");
            });
    },
    savePlayerCloudData: function(jsonData) {
        YGP.playerAccountModule.player
            .setData({playerData: jsonData}, true)
            .then(() => {
                YGP.logMessage("Successfully saved cloud data");
            })
            .catch(error => {
                YGP.logError("Failed to save cloud data", error);
            });
    },
    initializeLeaderboardsModule: function () {
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
    submitLeaderboardScore: function (leaderboardId, score) {
        try {
            YGP.leaderboardsModule
                .getLeaderboardPlayerEntry(leaderboardId)
                .then(result => {
                    //Score should be updated only if stored player's score is lower than new player score
                    //However, even if new score is lower it's treated as successful score submission  
                    if (result.score < score) {
                        YGP.leaderboardsModule.setLeaderboardScore(leaderboardId, score);
                    }
                    YGP.sendUnityMessage("OnLeaderboardScoreSubmissionSuccess", leaderboardId);
                })
                .catch(error => {
                    if (error.code === "LEADERBOARD_PLAYER_NOT_PRESENT") {
                        YGP.leaderboardsModule.setLeaderboardScore(leaderboardId, score);
                        YGP.sendUnityMessage("OnLeaderboardScoreSubmissionSuccess", leaderboardId);
                    }
                    else {
                        YGP.logError("Failed to submit score '" + score + "' to the leaderboard with id '" + leaderboardId + "'", error);
                        YGP.sendUnityMessage("OnLeaderboardScoreSubmissionFailure", leaderboardId);
                    }
                });
        }
        catch (error) {
            YGP.logError("Failed to submit score '" + score + "' to the leaderboard with id '" + leaderboardId + "'", error);
            YGP.sendUnityMessage("OnLeaderboardScoreSubmissionFailure", leaderboardId);
        }
    },
    getLeaderboardEntries: function (leaderboardId, includePlayer, topEntriesCount, surroundingEntriesCount) {
        try {
            YGP.leaderboardsModule
                .getLeaderboardEntries(leaderboardId, {
                    includeUser: includePlayer,
                    quantityTop: topEntriesCount,
                    quantityAround: surroundingEntriesCount
                })
                .then(result => {
                    let entries = [];
                    for (let i = 0; i < result.entries.length; ++i) {
                        entries[i] = {
                            IsPlayerEntry: result.userRank !== 0 && result.userRank == result.entries[i].rank,
                            Rank: result.entries[i].rank,
                            Username: result.entries[i].player.scopePermissions.public_name == "allow" ? result.entries[i].player.publicName : "anonymous",
                            Score: result.entries[i].score,
                        };
                    }

                    YGP.sendUnityMessage("OnLeaderboardRecordsReceived", JSON.stringify({
                        LeaderboardId: leaderboardId,
                        Entries: entries,
                    }));
                });
        }
        catch (error) {
            YGP.logError("Failed to get leaderboard '" + leaderboardId + "' entries", error);
        }
    },
    showReviewPopup: function () {
        try {
            YGP.ysdk.feedback.canReview()
                .then(({value, reason}) => {
                    if (value) {
                        YGP.ysdk.feedback.requestReview()
                            .then(userResult => {
                                YGP.logMessage("User review result: " + userResult);
                            })
                            .catch(error => {
                                YGP.logError("Failed to request review", error);
                            });
                    }
                    else {
                        YGP.logMessage("Review is unavailable: " + reason);
                    }
                })
                .catch(error => {
                    YGP.logError("Failed to identify canReview state", error);
                });
        }
        catch (error) {
            YGP.logError("Failed display review dialog", error);
        }
    },
    getPreferredLanguage: function () {
        try {
            let sdk = YGP.ysdk == null ? window.YGPsdk : YGP.ysdk;
            if (sdk == null) {
                YGP.logError("Failed to get preferred language: sdk not found");
                return null;
            }
            let language = sdk.environment.i18n.lang; 
            let bufferSize = lengthBytesUTF8(language) + 1;
            let buffer = _malloc(bufferSize);
            stringToUTF8(language, buffer, bufferSize);
            return buffer;
        }
        catch (error) {
            YGP.logError("Failed to get preferred language", error);
        }
    },
};