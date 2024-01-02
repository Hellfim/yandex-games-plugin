using System;
using System.Runtime.InteropServices;
using UnityEngine;

namespace YandexGamesPlugin.Core
{
    public static class YandexGamesBridge
    {
        [DllImport("__Internal")]
        private static extern void Initialize(String listenerName);

        [DllImport("__Internal")]
        public static extern void SubmitGameReady();
        
        [DllImport("__Internal")]
        public static extern void ShowRewardedVideoAd();
        
        [DllImport("__Internal")]
        public static extern void DisplayBanner();
        
        [DllImport("__Internal")]
        public static extern void HideBanner();
        
        [DllImport("__Internal")]
        public static extern void InitializeIAPClient();

        [DllImport("__Internal")]
        public static extern void LoadIAPProducts();

        [DllImport("__Internal")]
        public static extern void PurchaseProduct(String productId);

        [DllImport("__Internal")]
        public static extern void ConsumeProduct(String productId);

        [DllImport("__Internal")]
        public static extern void ProcessUnconsumedProducts();

        [DllImport("__Internal")]
        public static extern void AuthenticatePlayer();

        [DllImport("__Internal")]
        public static extern void SubmitLeaderboardScore(String leaderboardId, Int32 score);

        public static void Initialize()
        {
            const String listenerObjectName = nameof(YandexGamesBridgeEventsListener);
            var gameObject = new GameObject(listenerObjectName);
            gameObject.AddComponent<YandexGamesBridgeEventsListener>();
            UnityEngine.Object.DontDestroyOnLoad(gameObject);
            Initialize(listenerObjectName);
        }
    }
}