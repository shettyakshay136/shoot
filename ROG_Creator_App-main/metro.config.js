const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {
  transformer: {
    ...defaultConfig.transformer,
    unstable_allowRequireContext: true,
  },
  resolver: {
    ...defaultConfig.resolver,
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
