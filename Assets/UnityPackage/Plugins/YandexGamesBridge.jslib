var yandexBridgeLibrary = {
    Initialize: function (listenerName) {
        YGP.unityListenerName = UTF8ToString(listenerName);
        YGP.initialize();
    },    
    SubmitGameReady: function () {
        YGP.submitGameReady();
    },
    SubmitGameplayStart: function () {
        YGP.submitGameplayStart();
    },
    SubmitGameplayStop: function () {
        YGP.submitGameplayStop();
    },
    ShowInterstitialAd: function () {
        YGP.showInterstitialAd();
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
    AuthenticatePlayer: function () {
        YGP.authenticatePlayer();
    },
    LoadPlayerCloudData: function () {
        YGP.loadPlayerCloudData();
    },
    SavePlayerCloudData: function(jsonDataPointer) {
        YGP.savePlayerCloudData(UTF8ToString(jsonDataPointer));
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
    ShowReviewPopup: function () {
        YGP.showReviewPopup();
    },
    GetPreferredLanguage: function () {
        return YGP.getPreferredLanguage();
    },
};
mergeInto(LibraryManager.library, yandexBridgeLibrary);