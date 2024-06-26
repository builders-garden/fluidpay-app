module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
      ["@babel/plugin-transform-class-properties", { loose: true }],
      "@babel/plugin-transform-flow-strip-types",
      ["@babel/plugin-transform-private-methods", { loose: true }],
    ],
  };
};
