using System;

namespace YandexGamesPlugin.Core.UnityPurchase
{
    [Serializable]
    public class YandexGamesProductInfo
    {
        public String Id;
        public String Title;
        public String Description;
        public String Price;
        public String PriceValue;
        public String PriceCurrencyCode;
    }
}