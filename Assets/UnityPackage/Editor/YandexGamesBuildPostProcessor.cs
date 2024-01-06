#if UNITY_WEBGL
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace YandexGamesPlugin.Editor
{
    public class YandexGamesBuildProcessor : IPreprocessBuildWithReport, IPostprocessBuildWithReport
    {
        private const String TemplateName = "Yandex";
        private const String ProjectTemplatesRootFolder = "Assets/WebGLTemplates/";
        private const String TemporaryTemplateFolder = ProjectTemplatesRootFolder + TemplateName;

        private const String PackageName = "com.hellfim.yandex-games-plugin";
        private static Boolean IsAssetPackage => UnityEditor.PackageManager.PackageInfo.FindForAssembly(System.Reflection.Assembly.GetExecutingAssembly()) == null;

        private static String GetAbsolutePackageRootPath()
        {
            return IsAssetPackage ? Application.dataPath : GetLibraryPackagePath(PackageName);
        }

        private static String GetLibraryPackagePath(String packageName)
        {
            var projectPath = Directory.GetParent(Application.dataPath)?.FullName;
            var packagesCachePath = $"{projectPath}/Library/PackageCache";
            var packagesLibraryPaths = Directory.GetDirectories(packagesCachePath);
            var packageLibraryPath = packagesLibraryPaths.FirstOrDefault(path => new DirectoryInfo(path).Name.StartsWith(packageName));
            
            return packageLibraryPath;
        }
        
        public Int32 callbackOrder => 0;

        public void OnPreprocessBuild(BuildReport report)
        {
            if (IsAssetPackage) //Copying is required only for library packages
            {
                return;
            }
            
            var destinationFolder = Path.GetFullPath(TemporaryTemplateFolder);
            var sourceFolder = $"{GetAbsolutePackageRootPath()}/WebGLTemplates/{TemplateName}";

            Directory.CreateDirectory(destinationFolder);
            FileUtil.ReplaceDirectory(sourceFolder, destinationFolder);

            RegenerateGuids(destinationFolder);
            
            AssetDatabase.Refresh();

            PlayerSettings.WebGL.template = $"PROJECT:{TemplateName}";
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            AssetDatabase.DeleteAsset(TemporaryTemplateFolder);
            if (Directory.EnumerateFiles(ProjectTemplatesRootFolder).Any())
            {
                return;
            }
            
            AssetDatabase.DeleteAsset(ProjectTemplatesRootFolder);
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
#endif