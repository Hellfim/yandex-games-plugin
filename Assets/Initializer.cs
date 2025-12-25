using System;
using UnityEngine;
using YandexGamesPlugin.Core;

namespace DefaultNamespace
{
    public class Initializer : MonoBehaviour
    {
        private void Start()
        {
            Debug.Log("Starting");
            
            YandexGamesBridgeEventsListener.InitializationFinished += OnInitializationFinished;
            YandexGamesBridge.Initialize();
        }

        private void OnDestroy()
        {
            YandexGamesBridgeEventsListener.InitializationFinished -= OnInitializationFinished;
        }

        private void OnInitializationFinished(Boolean result)
            => Debug.Log(result ? "Success!" : "Failed!");
    }
}