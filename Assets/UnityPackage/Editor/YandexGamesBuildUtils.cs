using System;
using System.IO;
using System.Linq;
using UnityEngine;

namespace YandexGamesPlugin.Editor
{
    public class YandexGamesBuildUtils
    {
        public static void RemoveSDKMocker(String buildPath)
        {
            const String YandexGamesSDKMockerJSFilename = "yandex-sdk-mocker.js";
            
            var indexFilepath = $"{buildPath}/index.html";
            if (File.Exists(indexFilepath))
            {
                var lines = File.ReadAllLines(indexFilepath);
                var sdkMockerIncludeIndex = Array.FindIndex(lines, line => line.Contains($"<script src=\"{YandexGamesSDKMockerJSFilename}\"></script>"));
                if (sdkMockerIncludeIndex < 0)
                {
                    Debug.LogWarning("Failed to find YandexGamesSDKMocker reference in index.html");
                }
                else
                {
                    File.WriteAllLines(indexFilepath, lines.Where((_, lineIndex) => lineIndex != sdkMockerIncludeIndex));
                }
            }
            else
            {
                Debug.LogError("Failed to locate index.html!");
            }

            var mockerFilepath = $"{buildPath}/{YandexGamesSDKMockerJSFilename}";
            if (File.Exists(mockerFilepath))
            {
                File.Delete(mockerFilepath);
            }
            else
            {
                Debug.LogError($"Failed to locate {YandexGamesSDKMockerJSFilename}!");
            }
        }
    }
}