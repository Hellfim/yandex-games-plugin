using System;
using UnityEngine;

namespace YandexGamesPlugin.Core
{
    public class YandexGamesBridgeEventsListener : MonoBehaviour
    {
        public static event Action Initialized;
        public static event Action InitializationFailed;
        
        private void OnSdkSuccessfullyInitialized()
        {
            Initialized?.Invoke();
        }
        
        private void OnSdkInitializationFailure()
        {
            InitializationFailed?.Invoke();
        }
    }
}