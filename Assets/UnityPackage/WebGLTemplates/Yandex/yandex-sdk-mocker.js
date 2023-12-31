const ygp_mock_helper = {
    logMessage: function(message) {
        console.log("[YGP.Mocker]: " + message);
    },

    timeout: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const ygp_sdk_mock_leaderboardsModule = {
    setLeaderboardScore: function (leaderboardId, score) {
        ygp_mock_helper.logMessage("leaderboardsModule.setLeaderboardScore");
    }
}

const ygp_sdk_mock_iapModule = {
    productsCatalog: [],
    purchases: [],
    getCatalog: function() {
        ygp_mock_helper.logMessage("iapModule.getCatalog");
        return new Promise((resolve, reject) => {
            resolve(this.productsCatalog);
        });
    },
    getPurchases: function() {
        ygp_mock_helper.logMessage("iapModule.getPurchases");
        return new Promise((resolve, reject) => {
            resolve(this.purchases);
        });
    },
    purchase: function(productId) {
        ygp_mock_helper.logMessage("iapModule.purchase");
        return new Promise((resolve, reject) => {
            for (let i = 0; i < productsCatalog.length; ++i) {
                if (productsCatalog[i].id === productId) {
                    resolve({productID: productId});
                    break;
                }
            }

            reject({name: "PurchaseFailure", message: "Product with provided ID '" + productId + "' not found in the catalog!"});
        });
    },
    consumePurchase: function (purchaseToken) {
        ygp_mock_helper.logMessage("iapModule.consumePurchase")
    }
}

const ygp_sdk_mock = {
    playerAuthenticationStatus: "lite",
    features: {
        LoadingAPI: {
            ready: function() {
                ygp_mock_helper.logMessage("features.LoadingAPI.ready");
            }
        }
    },
    adv: {
        showRewardedVideo: async function (container) {
            ygp_mock_helper.logMessage("adv.showRewardedVideo started");
            await ygp_mock_helper.timeout(1000);
            container.callbacks.onOpen();
            await ygp_mock_helper.timeout(2000);
            container.callbacks.onRewarded();
            await ygp_mock_helper.timeout(1000);
            container.callbacks.onClose();
            ygp_mock_helper.logMessage("adv.showRewardedVideo ended");
        },
        showBannerAdv: function() {
            ygp_mock_helper.logMessage("adv.showBannerAdv");
        },
        hideBannerAdv: function() {
            ygp_mock_helper.logMessage("adv.hideBannerAdv");
        }
    },
    getPayments: function () {
        ygp_mock_helper.logMessage("getPayments");
        return new Promise((resolve, reject) => {
            resolve(ygp_sdk_mock_iapModule);
        });
    },
    getPlayer: function () {
        ygp_mock_helper.logMessage("getPlayer");
        return new Promise((resolve, reject) => {
            resolve({
                getMode: function () {
                    ygp_mock_helper.logMessage("player.getMode");
                    return ygp_sdk_mock.playerAuthenticationStatus;
                }
            });
        });
    },
    auth: {
        openAuthDialog: function () {
            ygp_mock_helper.logMessage("auth.openAuthDialog");
            return new Promise(async (resolve, reject) => {
                ygp_mock_helper.logMessage("openAuthDialog started");
                await ygp_mock_helper.timeout(2000);
                ygp_sdk_mock.playerAuthenticationStatus = "";
                ygp_mock_helper.logMessage("openAuthDialog ended");
                resolve();
            });
        }
    },
    getLeaderboards: function () {
        ygp_mock_helper.logMessage("getLeaderboards");
        return new Promise((resolve, reject) => {
            resolve(ygp_sdk_mock_leaderboardsModule);
        });
    },
    feedback: {
        canReview: function () {
            ygp_mock_helper.logMessage("feedback.canReview");
            return new Promise((resolve, reject) => {
                resolve({
                    value: ygp_sdk_mock.playerAuthenticationStatus !== "lite",
                    reason: ygp_sdk_mock.playerAuthenticationStatus !== "lite" ? "" : "NO_AUTH"
                });
            });
        },
        requestReview: function () {
            ygp_mock_helper.logMessage("feedback.requestReview");
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
    },
}

const YaGames = {
    init: function () {
        ygp_mock_helper.logMessage("YaGames.init");
        return new Promise((resolve, reject) => {
            resolve(ygp_sdk_mock);
        });
    }
}
