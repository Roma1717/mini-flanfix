/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // Добавляем поддерживаемые расширения
    config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json'];

    return config;
})();