using System.Runtime.InteropServices;

namespace YandexGamesPlugin.Core
{
    public static class YandexGamesBridge
    {
        [DllImport("__Internal")]
        public static extern void Initialize();
    }
}