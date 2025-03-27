// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('glb');


[("js", "jsx", "json", "ts", "tsx", "cjs", "mjs")].forEach((ext) => {
  if (defaultConfig.resolver.sourceExts.indexOf(ext) === -1) {
    defaultConfig.resolver.sourceExts.push(ext);
  }
});

["glb", "gltf", "png", "jpg"].forEach((ext) => {
  if (defaultConfig.resolver.assetExts.indexOf(ext) === -1) {
    defaultConfig.resolver.assetExts.push(ext);
  }
});

module.exports = defaultConfig;