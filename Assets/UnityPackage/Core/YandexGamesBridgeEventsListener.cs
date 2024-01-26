using System;
using UnityEngine;
using YandexGamesPlugin.Core.UnityPurchase;

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

        public static event Action IAPModuleInitialized;
        public static event Action<String> IAPModuleInitializationFailed;
        public static event Action<String> IAPProductsLoaded;
        public static event Action<YandexGamesPurchase> ProductPurchased;
        public static event Action<String> ProductPurchaseFailed;
        
        public static event Action PlayerAuthenticated;
        public static event Action PlayerAuthenticationFailed;
        
        public static event Action<String, Boolean> LeaderboardScoreProcessed;
        public static event Action<String, YandexGamesLeaderboardEntry[]> LeaderboardRecordsReceived;
        
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
        
        private void OnIAPModuleInitialized()
        {
            IAPModuleInitialized?.Invoke();
        }
        
        private void OnIAPModuleInitializationFailed(String message)
        {
            IAPModuleInitializationFailed?.Invoke(message);
        }
        
        private void OnIAPProductsLoaded(String jsonProductsMetadata)
        {
            IAPProductsLoaded?.Invoke(jsonProductsMetadata);
        }
        
        private void OnProductPurchased(String serializedPurchase)
        {
            ProductPurchased?.Invoke(JsonUtility.FromJson<YandexGamesPurchase>(serializedPurchase));
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
        
        private void OnLeaderboardScoreSubmissionSuccess(String leaderboardId)
        {
            LeaderboardScoreProcessed?.Invoke(leaderboardId, true);
        }
        
        private void OnLeaderboardScoreSubmissionFailure(String leaderboardId)
        {
            LeaderboardScoreProcessed?.Invoke(leaderboardId, false);
        }
        
        private void OnLeaderboardRecordsReceived(String jsonResponse)
        {
            var response = JsonUtility.FromJson<YandexGamesGetLeaderboardRecordsResponse>(jsonResponse);
            LeaderboardRecordsReceived?.Invoke(response.LeaderboardId, response.Entries ?? Array.Empty<YandexGamesLeaderboardEntry>());
        }
    }
}