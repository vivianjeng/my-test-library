const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...config.resolver.assetExts, 'zkey', 'bin', 'json', 'local'];

module.exports = withMetroConfig(config, {
  root,
  dirname: __dirname,
});
