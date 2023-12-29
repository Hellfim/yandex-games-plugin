#if UNITY_WEBGL
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace UnityPackage.Editor
{
    public class YandexGamesBuildProcessor : IPreprocessBuildWithReport, IPostprocessBuildWithReport
    {
        private const String TemplateName = "Yandex";
        private const String ProjectTemplateFolder = "Assets/WebGLTemplates/" + TemplateName;

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
            
            var destinationFolder = Path.GetFullPath(ProjectTemplateFolder);
            var sourceFolder = $"{GetAbsolutePackageRootPath()}/WebGLTemplates/{TemplateName}";

            FileUtil.ReplaceDirectory(sourceFolder, destinationFolder);

            AssetDatabase.Refresh();

            PlayerSettings.WebGL.template = $"PROJECT:{TemplateName}";
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            AssetDatabase.DeleteAsset(ProjectTemplateFolder);
        }
    }
}
#endif