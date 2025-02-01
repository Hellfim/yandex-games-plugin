using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace YandexGamesPlugin.Editor
{
    public class YandexGamesBuildUtils
    {
        private const String TemplateName = "Yandex";
        private const String ProjectTemplatesRootFolder = "Assets/WebGLTemplates/";
        private const String TemporaryTemplateFolder = ProjectTemplatesRootFolder + TemplateName;

        private const String PackageName = "com.hellfim.yandex-games-plugin";
        private static Boolean IsAssetPackage => UnityEditor.PackageManager.PackageInfo.FindForAssembly(System.Reflection.Assembly.GetExecutingAssembly()) == null;

        private static String GetAbsolutePackageRootPath()
            => IsAssetPackage ? $"{Application.dataPath}/UnityPackage" : GetLibraryPackagePath(PackageName);

        private static String GetLibraryPackagePath(String packageName)
        {
            var projectPath = Directory.GetParent(Application.dataPath)?.FullName;
            var packagesCachePath = $"{projectPath}/Library/PackageCache";
            var packagesLibraryPaths = Directory.GetDirectories(packagesCachePath);
            var packageLibraryPath = packagesLibraryPaths.FirstOrDefault(path => new DirectoryInfo(path).Name.StartsWith(packageName));

            return packageLibraryPath;
        }

        public static void PreprocessBuild(BuildReport report)
        {
            var destinationFolder = Path.GetFullPath(TemporaryTemplateFolder);
            var sourceFolder = $"{GetAbsolutePackageRootPath()}/WebGLTemplates/{TemplateName}";

            Directory.CreateDirectory(destinationFolder);
            FileUtil.ReplaceDirectory(sourceFolder, destinationFolder);

            RegenerateGuids(destinationFolder);

            AssetDatabase.Refresh();

            PlayerSettings.WebGL.template = $"PROJECT:{TemplateName}";
        }

        public static void PostprocessBuild(BuildReport report)
        {
            AssetDatabase.DeleteAsset(TemporaryTemplateFolder);
            if (Directory.EnumerateFiles(ProjectTemplatesRootFolder).Any())
            {
                return;
            }

            AssetDatabase.DeleteAsset(ProjectTemplatesRootFolder);
        }

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

        private static void RegenerateGuids(String destinationFolder)
        {
            var filePaths = Directory.GetFiles(destinationFolder, "*.meta");
            foreach (var filePath in filePaths)
            {
                var lines = File.ReadAllLines(filePath);
                var guidLineIndex = Array.FindIndex(lines, line => line.StartsWith("guid:"));
                if (guidLineIndex < 0)
                {
                    Debug.LogWarning($"Failed to find file GUID for file: {filePath}");
                    continue;
                }

                lines[guidLineIndex] = $"guid: {GUID.Generate()}";
                File.WriteAllLines(filePath, lines);
            }
        }
    }
}