using System;
using System.Runtime.InteropServices;

namespace YandexGamesPlugin.Core
{
    public static partial class YandexGamesBridge
    {
        [DllImport("__Internal")]
        public static extern void Initialize();
        
        [DllImport("__Internal")]
        private static extern Int32 GetInitializationResult();

        [DllImport("__Internal")]
        public static extern void SubmitGameReady();

        public static InitializationResult InitializationResult
        {
            get
            {
                return GetInitializationResult() switch
                {
                    1 => InitializationResult.Success,
                    2 => InitializationResult.Failure,
                    _ => InitializationResult.Undefined,
                };
            }
        }
    }
}