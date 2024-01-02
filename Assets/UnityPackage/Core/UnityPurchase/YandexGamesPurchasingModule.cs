﻿using UnityEngine.Purchasing.Extension;

namespace YandexGamesPlugin.Core.UnityPurchase
{
    public class YandexGamesPurchasingModule : AbstractPurchasingModule
    {
        public override void Configure()
        {
            RegisterStore("YandexGames", YandexGamesStore.GetInstance());
        }

        private static YandexGamesPurchasingModule _currentInstance;

        public static YandexGamesPurchasingModule Instance()
        {
            if (_currentInstance != null)
            {
                return _currentInstance;
            }

            _currentInstance = new YandexGamesPurchasingModule();
            return _currentInstance;
        }
    }
}