using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Newtonsoft.Json;
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
        public static extern void SubmitGameplayStart();

        [DllImport("__Internal")]
        public static extern void SubmitGameplayStop();

        [DllImport("__Internal")]
        public static extern void ShowInterstitialAd();

        [DllImport("__Internal")]
        public static extern void ShowRewardedVideoAd();

        [DllImport("__Internal")]
        public static extern void DisplayBanner();

        [DllImport("__Internal")]
        public static extern void HideBanner();

        [DllImport("__Internal")]
        private static extern void InitializeIAPModule();

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
        public static extern void LoadPlayerCloudData();

        [DllImport("__Internal")]
        private static extern void SavePlayerCloudData(String jsonData);

        [DllImport("__Internal")]
        private static extern void InitializeLeaderboardsModule();

        [DllImport("__Internal")]
        public static extern void SubmitLeaderboardScore(String leaderboardId, Int32 score);

        [DllImport("__Internal")]
        public static extern void GetLeaderboardEntries(String leaderboardId, Boolean includePlayer, Int32 topEntriesCount, Int32 surroundingEntriesCount);

        [DllImport("__Internal")]
        public static extern void ShowReviewPopup();

        [DllImport("__Internal")]
        public static extern String GetPreferredLanguage();

        private static Boolean _isSDKInitialized;
        private static Boolean _isSDKBeingInitialized;

        private static readonly List<Action> _initializationCallbacks = new List<Action>();

        public static void InitializePurchaseModule() => InitializeModule(InitializeIAPModule);

        public static void InitializeLeaderboards() => InitializeModule(InitializeLeaderboardsModule);

        public static void Initialize()
        {
            if (_isSDKInitialized || _isSDKBeingInitialized)
            {
                return;
            }

            _isSDKBeingInitialized = true;

            const String listenerObjectName = nameof(YandexGamesBridgeEventsListener);
            var gameObject = new GameObject(listenerObjectName);
            gameObject.AddComponent<YandexGamesBridgeEventsListener>();
            UnityEngine.Object.DontDestroyOnLoad(gameObject);

            YandexGamesBridgeEventsListener.InitializationFinished += OnInitializationFinished;
            Initialize(listenerObjectName);
        }

        private static void OnInitializationFinished(Boolean result)
        {
            YandexGamesBridgeEventsListener.InitializationFinished -= OnInitializationFinished;
            _isSDKBeingInitialized = false;

            if (!result)
            {
                return;
            }

            _isSDKInitialized = true;
            foreach (var initializationCallback in _initializationCallbacks)
            {
                initializationCallback?.Invoke();
            }

            _initializationCallbacks.Clear();
        }

        private static void InitializeModule(Action initializationMethod)
        {
            if (_isSDKInitialized)
            {
                initializationMethod();
            }
            else
            {
                _initializationCallbacks.Add(initializationMethod);
                if (_isSDKBeingInitialized)
                {
                    return;
                }

                Initialize();
            }
        }

        public static void GetLeaderboardRecords(String leaderboardId, Boolean includePlayer, Int32 topEntriesCount, Int32 surroundingEntriesCount)
        {
            GetLeaderboardEntries(leaderboardId, includePlayer, topEntriesCount, surroundingEntriesCount);
        }

        public static void SavePlayerCloudData(YandexGamesPlayerCloudData data)
            => SavePlayerCloudData(JsonConvert.SerializeObject(data));
    }
}