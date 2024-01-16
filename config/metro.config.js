const { getDefaultConfig } = require("expo/metro-config");

const getDefaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetEcts.push("cjs");

module.exports = defaultConfig;