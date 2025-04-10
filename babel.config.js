module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-class-static-block',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@styles': './src/styles',
          '@service': './src/service',
          '@state': './src/state',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
