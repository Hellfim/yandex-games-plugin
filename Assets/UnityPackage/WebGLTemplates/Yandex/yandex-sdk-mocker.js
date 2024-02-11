const ygp_mock_helper = {
    logMessage: function(message) {
        console.log("[YGP.Mocker]: " + message);
    },

    timeout: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const ygp_sdk_mock_leaderboardsModule = {
    createLeaderboardEntry: function (position, username, score) {
        return {
            score: score,
            rank: position,
            player: {
                publicName: username,
                scopePermissions: {
                    public_name: "allow"
                }
            }
        };
    },
    setLeaderboardScore: function (leaderboardId, score) {
        ygp_mock_helper.logMessage("leaderboardsModule.setLeaderboardScore");
    },
    getLeaderboardEntries: function (leaderboardId, params) {
        ygp_mock_helper.logMessage("leaderboardsModule.getLeaderboardEntries");
        return new Promise((resolve, reject) => {
            let maxScore = 10000;
            let playerPosition = 0;
            let dummyEntries = [];

            if (params.includeUser) {
                playerPosition = 342;
                let playerScore = 240;
                dummyEntries[0] = this.createLeaderboardEntry(playerPosition, "YOU", playerScore);
                for (let i = 0; i < params.quantityAround; ++i) {
                    dummyEntries[dummyEntries.length] = this.createLeaderboardEntry(playerPosition - i - 1, "CoolGuy" + (i + 1), playerScore + (i + 1) * 23);
                }
                for (let i = 0; i < params.quantityAround; ++i) {
                    dummyEntries[dummyEntries.length] = this.createLeaderboardEntry(playerPosition + i + 1, "LameGuy" + (i + 1), playerScore - (i + 1) * 13);
                }
            }

            for (let i = 0; i < params.quantityTop; ++i) {
                dummyEntries[dummyEntries.length] = this.createLeaderboardEntry(i + 1, "ReallyCoolGuy" + i, maxScore - i * 34);
            }

            resolve({
                userRank: playerPosition,
                entries: dummyEntries,
            });
        });
    }
}

const ygp_sdk_mock_playerAccountModule = {
    authenticationStatus: "lite",
    getMode: function () {
        ygp_mock_helper.logMessage("player.getMode");
        return this.authenticationStatus;
    },
    getData: function (keys) {
        ygp_mock_helper.logMessage("player.getData");
        return new Promise((resolve, reject) => {
            resolve({
                StringData: {},
                IntegerData: {},
            });
        });
    },
    setData: function (data, flush) {
        ygp_mock_helper.logMessage("player.setData");
        return new Promise((resolve, reject) => {
            resolve();
        });
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
            resolve(ygp_sdk_mock_playerAccountModule);
        });
    },
    auth: {
        openAuthDialog: function () {
            ygp_mock_helper.logMessage("auth.openAuthDialog");
            return new Promise(async (resolve, reject) => {
                ygp_mock_helper.logMessage("openAuthDialog started");
                await ygp_mock_helper.timeout(2000);
                ygp_sdk_mock_playerAccountModule.authenticationStatus = "";
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
                    value: ygp_sdk_mock_playerAccountModule.authenticationStatus !== "lite",
                    reason: ygp_sdk_mock_playerAccountModule.authenticationStatus !== "lite" ? "" : "NO_AUTH"
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
    environment: {
        i18n: {
            lang: "en"
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
