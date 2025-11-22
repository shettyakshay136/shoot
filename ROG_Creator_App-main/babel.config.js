module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    'module:react-native-dotenv',
    'react-native-auto-route/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
  ],
};
