#if YANDEX_GAMES_BUILD
using UnityEngine.Purchasing.Extension;

namespace YandexGamesPlugin.Runtime.UnityPurchase
{
    public class YandexGamesPurchasingModule : AbstractPurchasingModule
    {
        public override void Configure()
            => RegisterStore("YandexGames", YandexGamesStore.GetInstance());

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
#endif