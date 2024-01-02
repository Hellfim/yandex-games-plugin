using System;
using UnityEngine;

namespace YandexGamesPlugin.Core
{
    public class YandexGamesBridgeEventsListener : MonoBehaviour
    {
        public static event Action SdkInitialized;
        public static event Action SdkInitializationFailed;
        
        public static event Action RewardedVideoAdOpened;
        public static event Action RewardedVideoAdFinished;
        public static event Action RewardedVideoAdClosed;
        public static event Action RewardedVideoAdReceivedError;

        public static event Action IAPClientInitialized;
        public static event Action<String> IAPClientInitializationFailed;
        public static event Action<String> IAPProductsLoaded;
        public static event Action<String> ProductPurchased;
        public static event Action<String> ProductPurchaseFailed;
        
        public static event Action PlayerAuthenticated;
        public static event Action PlayerAuthenticationFailed;
        
        private void OnSdkSuccessfullyInitialized()
        {
            SdkInitialized?.Invoke();
        }
        
        private void OnSdkInitializationFailure()
        {
            SdkInitializationFailed?.Invoke();
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
        
        private void OnIAPClientInitialized()
        {
            IAPClientInitialized?.Invoke();
        }
        
        private void OnIAPClientInitializationFailed(String message)
        {
            IAPClientInitializationFailed?.Invoke(message);
        }
        
        private void OnIAPProductsLoaded(String jsonProductsMetadata)
        {
            IAPProductsLoaded?.Invoke(jsonProductsMetadata);
        }
        
        private void OnProductPurchased(String productId)
        {
            ProductPurchased?.Invoke(productId);
        }
        
        private void OnProductPurchaseFailed(String productId)
        {
            ProductPurchaseFailed?.Invoke(productId);
        }
        
        private void OnPlayerAuthenticated()
        {
            PlayerAuthenticated?.Invoke();
        }
        
        private void OnPlayerAuthenticationFailed()
        {
            PlayerAuthenticationFailed?.Invoke();
        }
    }
}