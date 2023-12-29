using System;
using Cysharp.Threading.Tasks;

namespace YandexGamesPlugin.Core
{
    public static partial class YandexGamesBridge
    {
        public static async UniTask<Boolean> InitializeAsync()
        {
            Initialize();
            await UniTask.WaitWhile(() => InitializationResult == InitializationResult.Undefined);
            return InitializationResult == InitializationResult.Success;
        }
    }
}