using System;
using System.Collections.Generic;

namespace YandexGamesPlugin.Core
{
    [Serializable]
    public class YandexGamesPlayerCloudData
    {
        public Dictionary<String, String> StringData;
        public Dictionary<String, Int32> IntegerData;
        public Dictionary<String, Single> FloatData;
    }
}