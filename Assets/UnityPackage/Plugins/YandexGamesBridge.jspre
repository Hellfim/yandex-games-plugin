let YGP = {
    ysdk: null,
        iapModule: null,
        playerAccountModule: null,
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
    getSerializedPurchase: function(purchase) {
        return JSON.stringify({
            ProductId: purchase.productID,
            TransactionId: purchase.purchaseToken
        });
    },
    sendUnityMessage: function (methodName, optionalParameter) { //multiple optional parameters are not supported by Unity's SendMessage
        unityInstance.SendMessage(YGP.unityListenerName, methodName, optionalParameter);
    },
    loadPlayerCloudData: function() {
        if (this.playerAccountModule == null || this.playerAccountModule.player == null) {
            this.logError("Player account module is not initialized")
            this.sendUnityMessage("OnCloudPlayerDataLoaded", "LoadingError");
            return;
        }

        this.playerAccountModule.player
            .getData()
            .then(blob => {
                this.sendUnityMessage("OnCloudPlayerDataLoaded", JSON.stringify(blob));
            })
            .catch(error => {
                this.logError("Failed to load cloud data", error);
            });
    },
};