import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const expoFontShim = fileURLToPath(new URL("./src/expoFontShim.ts", import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: "expo-vector-icons-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.includes("@expo/vector-icons") || !/\.[cm]?jsx?$/.test(id)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "expo-font": expoFontShim,
    },
  },
  define: {
    __DEV__: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
      define: {
        __DEV__: "false",
      },
    },
  },
});
