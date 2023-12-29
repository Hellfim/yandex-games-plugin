using System.Runtime.InteropServices;

namespace YandexGamesPlugin.Core
{
    public static class YandexGamesBridge
    {
        [DllImport("__Internal")]
        private static extern void TestMethod();
    }
}