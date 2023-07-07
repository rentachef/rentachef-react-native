module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [[
    'react-native-reanimated/plugin'
  ],
  [
    "module-resolver",
    {
      root: ["./"],
      extensions: [".js", ".ts", ".tsx", ".jsx", ".json"],
      alias: {
        // This needs to be mirrored in tsconfig.json
        "@assets": "./src/assets",
      },
    },
  ],
],
};