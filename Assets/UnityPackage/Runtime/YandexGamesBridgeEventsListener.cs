using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;
using YandexGamesPlugin.Runtime.UnityPurchase;

namespace YandexGamesPlugin.Runtime
{
    public class YandexGamesBridgeEventsListener : MonoBehaviour
    {
        public static event Action<Boolean> InitializationFinished;

        public static event Action InterstitialAdOpened;
        public static event Action InterstitialAdClosed;
        public static event Action InterstitialAdReceivedError;

        public static event Action RewardedVideoAdOpened;
        public static event Action RewardedVideoAdFinished;
        public static event Action RewardedVideoAdClosed;
        public static event Action RewardedVideoAdReceivedError;

        public static event Action PurchaseModuleInitialized;
        public static event Action<String> PurchaseModuleInitializationFailed;

        public static event Action<String> ProductsLoaded;

        public static event Action<YandexGamesPurchase> ProductPurchased;
        public static event Action<String> ProductPurchaseFailed;

        public static event Action PlayerAuthenticated;
        public static event Action PlayerAuthenticationFailed;

        public static event Action<String, Boolean> LeaderboardScoreProcessed;
        public static event Action<String, YandexGamesLeaderboardEntry[]> LeaderboardRecordsReceived;

        public static event Action<YandexGamesPlayerCloudData> PlayerCloudDataLoaded;

        private void OnSdkSuccessfullyInitialized()
            => InitializationFinished?.Invoke(true);

        private void OnSdkInitializationFailure()
            => InitializationFinished?.Invoke(false);

        private void OnInterstitialAdOpened()
            => InterstitialAdOpened?.Invoke();

        private void OnInterstitialAdClosed()
            => InterstitialAdClosed?.Invoke();

        private void OnInterstitialAdReceivedError()
            => InterstitialAdReceivedError?.Invoke();

        private void OnRewardedVideoAdOpened()
            => RewardedVideoAdOpened?.Invoke();

        private void OnRewardedVideoAdFinished()
            => RewardedVideoAdFinished?.Invoke();

        private void OnRewardedVideoAdClosed()
            => RewardedVideoAdClosed?.Invoke();

        private void OnRewardedVideoAdReceivedError()
            => RewardedVideoAdReceivedError?.Invoke();

        private void OnIAPModuleInitialized()
            => PurchaseModuleInitialized?.Invoke();

        private void OnIAPModuleInitializationFailed(String message)
            => PurchaseModuleInitializationFailed?.Invoke(message);

        private void OnIAPProductsLoaded(String jsonProductsMetadata)
            => ProductsLoaded?.Invoke(jsonProductsMetadata);

        private void OnProductPurchased(String serializedPurchase)
            => ProductPurchased?.Invoke(JsonUtility.FromJson<YandexGamesPurchase>(serializedPurchase));

        private void OnProductPurchaseFailed(String productId)
            => ProductPurchaseFailed?.Invoke(productId);

        private void OnPlayerAuthenticated()
            => PlayerAuthenticated?.Invoke();

        private void OnPlayerAuthenticationFailed()
            => PlayerAuthenticationFailed?.Invoke();

        private void OnLeaderboardScoreSubmissionSuccess(String leaderboardId)
            => LeaderboardScoreProcessed?.Invoke(leaderboardId, true);

        private void OnLeaderboardScoreSubmissionFailure(String leaderboardId)
            => LeaderboardScoreProcessed?.Invoke(leaderboardId, false);

        private void OnLeaderboardRecordsReceived(String jsonResponse)
        {
            var response = JsonUtility.FromJson<YandexGamesGetLeaderboardRecordsResponse>(jsonResponse);
            LeaderboardRecordsReceived?.Invoke(response.LeaderboardId, response.Entries ?? Array.Empty<YandexGamesLeaderboardEntry>());
        }

        private void OnPlayerCloudDataLoaded(String jsonResponse)
        {
            if (String.Equals(jsonResponse, "LoadingError"))
            {
                Debug.LogError("Received an error during cloud data loading. See console for details");
                return;
            }

            var data = JsonConvert.DeserializeObject<YandexGamesPlayerCloudData>(jsonResponse);
            data.StringData ??= new Dictionary<String, String>();
            data.IntegerData ??= new Dictionary<String, Int32>();
            data.FloatData ??= new Dictionary<String, Single>();
            PlayerCloudDataLoaded?.Invoke(data);
        }
    }
}