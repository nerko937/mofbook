// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: [
            "dist/*",
            "node_modules/*",
            "ios/*",
            "android/*",
            "bin/*",
            "build/*",
            "expo-env.d.ts",
            "nativewind-env.d.ts",
            "bun.lock",
            ".expo/*"
        ]
    }
]);
