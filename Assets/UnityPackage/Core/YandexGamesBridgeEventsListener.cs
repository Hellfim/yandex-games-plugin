using System;
using UnityEngine;

namespace YandexGamesPlugin.Core
{
    public class YandexGamesBridgeEventsListener : MonoBehaviour
    {
        public static event Action Initialized;
        public static event Action InitializationFailed;
        public static event Action RewardedVideoAdOpened;
        public static event Action RewardedVideoAdFinished;
        public static event Action RewardedVideoAdClosed;
        public static event Action RewardedVideoAdReceivedError;
        
        private void OnSdkSuccessfullyInitialized()
        {
            Initialized?.Invoke();
        }
        
        private void OnSdkInitializationFailure()
        {
            InitializationFailed?.Invoke();
        }
        
        private void OnRewardedVideoAdOpened()
        {
            RewardedVideoAdOpened?.Invoke();
        }
        
        private void OnRewardedVideoAdFinished()
        {
            RewardedVideoAdFinished?.Invoke();
        }
        
        private void OnRewardedVideoAdClosed()
        {
            RewardedVideoAdClosed?.Invoke();
        }
        
        private void OnRewardedVideoAdReceivedError()
        {
            RewardedVideoAdReceivedError?.Invoke();
        }
    }
}