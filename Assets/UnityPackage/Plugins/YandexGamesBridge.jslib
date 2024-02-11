var yandexBridgeLibrary = {
    Initialize: function (listenerName) {
        YGP.unityListenerName = UTF8ToString(listenerName);
        YGP.initialize();
    },    
    SubmitGameReady: function () {
        YGP.submitGameReady();
    },    
    ShowRewardedVideoAd: function () {
        YGP.showRewardedVideoAd();
    },
    DisplayBanner: function () {
        YGP.displayBanner();
    },    
    HideBanner: function () {
        YGP.hideBanner();
    },    
    InitializeIAPModule: function () {
        YGP.initializeIAPModule();
    },    
    LoadIAPProducts: function () {
        YGP.loadIAPProducts();
    },    
    PurchaseProduct: function (productIdPointer) {
        YGP.purchaseProduct(UTF8ToString(productIdPointer));
    },    
    ConsumeProduct: function (productIdPointer) {
        YGP.consumeProduct(UTF8ToString(productIdPointer));
    },    
    ProcessUnconsumedProducts: function () {
        YGP.processUnconsumedProducts();
    },    
    InitializePlayerAccountModule: function() {
        YGP.initializePlayerAccountModule();
    },    
    AuthenticatePlayer: function () {
        YGP.authenticatePlayer();
    },    
    LoadCloudPlayerData: function () {
        YGP.loadPlayerCloudData();
    },    
    SaveCloudPlayerData: function(jsonBlobPointer) {
        YGP.savePlayerCloudData(UTF8ToString(jsonBlobPointer));
    },    
    InitializeLeaderboardsModule: function () {
        YGP.initializeLeaderboardsModule();
    },    
    SubmitLeaderboardScore: function (leaderboardIdPointer, score) {
        YGP.submitLeaderboardScore(UTF8ToString(leaderboardIdPointer), score);
    },    
    GetLeaderboardEntries: function (leaderboardIdPointer, includePlayer, topEntriesCount, surroundingEntriesCount) {
        YGP.getLeaderboardEntries(UTF8ToString(leaderboardIdPointer), includePlayer, topEntriesCount, surroundingEntriesCount);
    },
    DisplayInAppReviewPopup: function () {
        YGP.displayInAppReviewPopup();
    },
    GetPreferredLanguage: function () {
        return YGP.getPreferredLanguage();
    },
};
mergeInto(LibraryManager.library, yandexBridgeLibrary);