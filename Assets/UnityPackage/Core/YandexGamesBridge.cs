using System;
using System.Collections.Generic;
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
        private static extern void InitializeIAPClient();

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

        private static Boolean _isSDKInitialized;

        private static readonly List<Action> _initializationCallbacks = new List<Action>();

        public static void InitializeIAPs() => InitializeModule(InitializeIAPClient);

        public static void Initialize()
        {
            const String listenerObjectName = nameof(YandexGamesBridgeEventsListener);
            var gameObject = new GameObject(listenerObjectName);
            gameObject.AddComponent<YandexGamesBridgeEventsListener>();
            UnityEngine.Object.DontDestroyOnLoad(gameObject);
            
            YandexGamesBridgeEventsListener.SdkInitialized += OnSdkInitialized;
            Initialize(listenerObjectName);
        }

        private static void OnSdkInitialized()
        {
            YandexGamesBridgeEventsListener.SdkInitialized -= OnSdkInitialized;
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
            }
        }
    }
}