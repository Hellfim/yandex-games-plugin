using System.Runtime.InteropServices;

namespace UnityPackage.Core
{
    public static class YandexGamesBridge
    {
        [DllImport("__Internal")]
        private static extern void TestMethod();
    }
}