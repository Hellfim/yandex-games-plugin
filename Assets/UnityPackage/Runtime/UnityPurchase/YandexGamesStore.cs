using System;
using System.Collections.ObjectModel;
using System.Linq;
using UnityEngine;
using UnityEngine.Purchasing;
using UnityEngine.Purchasing.Extension;

namespace YandexGamesPlugin.Runtime.UnityPurchase
{
    public class YandexGamesStore : IStore
    {
        private static YandexGamesStore _currentInstance;

        public static YandexGamesStore GetInstance()
        {
            if (_currentInstance != null)
            {
                return _currentInstance;
            }

            _currentInstance = new YandexGamesStore();
            return _currentInstance;
        }

        private ReadOnlyCollection<ProductDefinition> _productDefinitions;

        private Boolean _isClientInitialized;
        private IStoreCallback _storeEvents;
        
        void IStore.Initialize(IStoreCallback callback)
        {
            _storeEvents = callback;

            YandexGamesBridge.InitializePurchaseModule();
            
            YandexGamesBridgeEventsListener.PurchaseModuleInitialized += OnPurchaseModuleInitialized;
            YandexGamesBridgeEventsListener.PurchaseModuleInitializationFailed += OnPurchaseModuleInitializationFailed;
            YandexGamesBridgeEventsListener.ProductsLoaded += OnProductsLoaded;
            YandexGamesBridgeEventsListener.ProductPurchased += OnProductPurchased;
            YandexGamesBridgeEventsListener.ProductPurchaseFailed += OnProductPurchaseFailed;
        }

        void IStore.RetrieveProducts(ReadOnlyCollection<ProductDefinition> products)
        {
            Debug.Log($"[YandexGamesStore] IAP RetrievedProducts:\n{String.Join("\n", products.Select(definition => $"Product Id: {definition.id}"))}");

            _productDefinitions = products;

            LoadProducts();
        }

        void IStore.Purchase(ProductDefinition product, String developerPayload)
        {
            if (_productDefinitions.All(d => d.storeSpecificId != product.storeSpecificId))
            {
                _storeEvents.OnPurchaseFailed(new PurchaseFailureDescription(product.id, PurchaseFailureReason.ProductUnavailable, "UnknownProduct"));
                return;
            }

            YandexGamesBridge.PurchaseProduct(product.storeSpecificId);
        }

        void IStore.FinishTransaction(ProductDefinition product, String transactionId)
        {
            if (product.type == ProductType.Consumable)
            {
                YandexGamesBridge.ConsumeProduct(product.storeSpecificId);
            }
        }

        private void OnPurchaseModuleInitialized()
        {
            _isClientInitialized = true;

            LoadProducts();
        }

        private void OnPurchaseModuleInitializationFailed(String message)
        {
            _storeEvents.OnSetupFailed(InitializationFailureReason.PurchasingUnavailable, message);
        }

        private void LoadProducts()
        {
            if (!_isClientInitialized || _productDefinitions == null)
            {
                return;
            }

            YandexGamesBridge.LoadIAPProducts();
        }
        
        private void OnProductsLoaded(String jsonProductsMetadata)
        {
            _storeEvents.OnProductsRetrieved(
                YandexGamesUtils.GetArrayFromJson<YandexGamesProductInfo>(jsonProductsMetadata)
                    .Select(GetProductDescriptionFromYandexGamesProductInfo)
                    .ToList());

            YandexGamesBridge.ProcessUnconsumedProducts();
        }
        
        private static ProductDescription GetProductDescriptionFromYandexGamesProductInfo(YandexGamesProductInfo productInfo)
        {
            Int32.TryParse(productInfo.PriceValue, out var price);

            return new ProductDescription(productInfo.Id, new ProductMetadata(productInfo.Price, productInfo.Title, productInfo.Description, productInfo.PriceCurrencyCode, price));
        }

        private void OnProductPurchased(YandexGamesPurchase purchase)
        {
            _storeEvents.OnPurchaseSucceeded(purchase.ProductId, null, purchase.TransactionId);
        }

        private void OnProductPurchaseFailed(String productId)
        {
            _storeEvents.OnPurchaseFailed(new PurchaseFailureDescription(productId, PurchaseFailureReason.Unknown, "See console for details"));
        }
    }
}