// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const extraNodeModules = require("node-libs-browser");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = extraNodeModules;
config.resolver.sourceExts.push("cjs");

// Enable package exports
config.resolver.unstable_enablePackageExports = true;

// Configure package exports
config.resolver.unstable_conditionNames = ["browser", "require"];
config.resolver.unstable_conditionsByPlatform = {
  ios: ["react-native", "browser", "main"],
  android: ["react-native", "browser", "main"],
  web: ["browser"],
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
