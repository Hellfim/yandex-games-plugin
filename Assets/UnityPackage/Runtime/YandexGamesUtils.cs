using System;
using UnityEngine;

namespace YandexGamesPlugin.Runtime
{
    public static class YandexGamesUtils
    {
        public static T[] GetArrayFromJson<T>(String json)
        {
            var newJson = "{ \"array\": " + json + "}";
            var wrapper = JsonUtility.FromJson<Wrapper<T>>(newJson);
            return wrapper.array;
        }

        [Serializable]
        private class Wrapper<T>
        {
            public T[] array;
        }
    }
}