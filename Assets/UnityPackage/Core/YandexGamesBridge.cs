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

        public static void Initialize()
        {
            const String listenerObjectName = nameof(YandexGamesBridgeEventsListener);
            var gameObject = new GameObject(listenerObjectName);
            gameObject.AddComponent<YandexGamesBridgeEventsListener>();
            Initialize(listenerObjectName);
        }
    }
}