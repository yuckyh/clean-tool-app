// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/yucky.hito/OneDrive%20-%20Luxottica%20Group%20S.p.A/Documents/Projects/clean-tool-app/.yarn/__virtual__/vite-virtual-46b6129e22/5/AppData/Local/Yarn/Berry/cache/vite-npm-4.4.11-e7ab057df9-10.zip/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/yucky.hito/OneDrive%20-%20Luxottica%20Group%20S.p.A/Documents/Projects/clean-tool-app/.yarn/__virtual__/@vitejs-plugin-react-swc-virtual-e158fe9d93/5/AppData/Local/Yarn/Berry/cache/@vitejs-plugin-react-swc-npm-3.4.0-a43216ef43-10.zip/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { VitePWA } from "file:///C:/Users/yucky.hito/OneDrive%20-%20Luxottica%20Group%20S.p.A/Documents/Projects/clean-tool-app/.yarn/__virtual__/vite-plugin-pwa-virtual-2aeb1898de/5/AppData/Local/Yarn/Berry/cache/vite-plugin-pwa-npm-0.16.5-4f15ac6a9e-10.zip/node_modules/vite-plugin-pwa/dist/index.js";
import mkcert from "file:///C:/Users/yucky.hito/OneDrive%20-%20Luxottica%20Group%20S.p.A/Documents/Projects/clean-tool-app/.yarn/__virtual__/vite-plugin-mkcert-virtual-935fc4eef7/5/AppData/Local/Yarn/Berry/cache/vite-plugin-mkcert-npm-1.16.0-433043c59f-10.zip/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import lightningcss from "file:///C:/Users/yucky.hito/AppData/Local/Yarn/Berry/cache/vite-plugin-lightningcss-npm-0.0.5-0d59160a02-10.zip/node_modules/vite-plugin-lightningcss/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\yucky.hito\\OneDrive - Luxottica Group S.p.A\\Documents\\Projects\\clean-tool-app";
var resolveDir = (dir) => resolve(__vite_injected_original_dirname, ...dir);
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = mode === "development";
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            reactHelpers: [
              "react-helmet-async",
              "react-router-dom",
              "react-dropzone"
            ],
            plotly: ["react-plotly.js", "plotly.js-cartesian-dist-min"],
            fluentui: ["@fluentui/react-components"],
            react: ["react", "react-dom"],
            tauri: ["@tauri-apps/api"]
          }
        }
      },
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
      cssMinify: isDev ? false : "lightningcss",
      // don't minify for debug builds
      minify: isDev ? false : "esbuild",
      // produce sourcemaps for debug builds
      sourcemap: isDev
    },
    plugins: [
      react(),
      VitePWA({
        manifest: {
          description: "A clean tool app for Essilor",
          short_name: "CleanToolApp",
          orientation: "landscape",
          name: "CLEaN Tool App",
          theme_color: "#0F6CBD",
          id: "/"
        },
        workbox: {
          globPatterns: [
            "**/*.{js,html,webmanifest}",
            "**/*.{svg,png,jpg,gif}"
          ]
        },
        registerType: "autoUpdate",
        injectRegister: "auto"
      }),
      lightningcss({
        browserslist: "last 2 versions, not dead, >0.2%, ie 11",
        sourceMap: isDev,
        minify: !isDev
      }),
      mkcert()
    ],
    preview: {
      strictPort: true,
      cors: false,
      https: true
    },
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      cors: false,
      https: true
    },
    resolve: {
      alias: {
        "@": resolveDir`src`
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env)
    },
    // },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    commonjsOptions: {
      esmExternals: true
    },
    // esbuild: {
    jsxInject: `import React from 'react'`,
    // env variables
    envPrefix: ["VITE_", "TAURI_"],
    // prevent vite from obscuring rust errors
    clearScreen: false
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx5dWNreS5oaXRvXFxcXE9uZURyaXZlIC0gTHV4b3R0aWNhIEdyb3VwIFMucC5BXFxcXERvY3VtZW50c1xcXFxQcm9qZWN0c1xcXFxjbGVhbi10b29sLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxceXVja3kuaGl0b1xcXFxPbmVEcml2ZSAtIEx1eG90dGljYSBHcm91cCBTLnAuQVxcXFxEb2N1bWVudHNcXFxcUHJvamVjdHNcXFxcY2xlYW4tdG9vbC1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3l1Y2t5LmhpdG8vT25lRHJpdmUlMjAtJTIwTHV4b3R0aWNhJTIwR3JvdXAlMjBTLnAuQS9Eb2N1bWVudHMvUHJvamVjdHMvY2xlYW4tdG9vbC1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCdcbmltcG9ydCBsaWdodG5pbmdjc3MgZnJvbSAndml0ZS1wbHVnaW4tbGlnaHRuaW5nY3NzJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbmNvbnN0IHJlc29sdmVEaXIgPSAoZGlyOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSkgPT4gcmVzb2x2ZShfX2Rpcm5hbWUsIC4uLmRpcilcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG4gIGNvbnN0IGlzRGV2ID0gbW9kZSA9PT0gJ2RldmVsb3BtZW50J1xuXG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICByZWFjdEhlbHBlcnM6IFtcbiAgICAgICAgICAgICAgJ3JlYWN0LWhlbG1ldC1hc3luYycsXG4gICAgICAgICAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICAgICAgICAgJ3JlYWN0LWRyb3B6b25lJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBwbG90bHk6IFsncmVhY3QtcGxvdGx5LmpzJywgJ3Bsb3RseS5qcy1jYXJ0ZXNpYW4tZGlzdC1taW4nXSxcbiAgICAgICAgICAgIGZsdWVudHVpOiBbJ0BmbHVlbnR1aS9yZWFjdC1jb21wb25lbnRzJ10sXG4gICAgICAgICAgICByZWFjdDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAgIHRhdXJpOiBbJ0B0YXVyaS1hcHBzL2FwaSddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gVGF1cmkgdXNlcyBDaHJvbWl1bSBvbiBXaW5kb3dzIGFuZCBXZWJLaXQgb24gbWFjT1MgYW5kIExpbnV4XG4gICAgICB0YXJnZXQ6IGVudi5UQVVSSV9QTEFURk9STSA9PT0gJ3dpbmRvd3MnID8gJ2Nocm9tZTEwNScgOiAnc2FmYXJpMTMnLFxuICAgICAgY3NzTWluaWZ5OiBpc0RldiA/IGZhbHNlIDogJ2xpZ2h0bmluZ2NzcycsXG4gICAgICAvLyBkb24ndCBtaW5pZnkgZm9yIGRlYnVnIGJ1aWxkc1xuICAgICAgbWluaWZ5OiBpc0RldiA/IGZhbHNlIDogJ2VzYnVpbGQnLFxuICAgICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcbiAgICAgIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIGNsZWFuIHRvb2wgYXBwIGZvciBFc3NpbG9yJyxcbiAgICAgICAgICBzaG9ydF9uYW1lOiAnQ2xlYW5Ub29sQXBwJyxcbiAgICAgICAgICBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsXG4gICAgICAgICAgbmFtZTogJ0NMRWFOIFRvb2wgQXBwJyxcbiAgICAgICAgICB0aGVtZV9jb2xvcjogJyMwRjZDQkQnLFxuICAgICAgICAgIGlkOiAnLycsXG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICBnbG9iUGF0dGVybnM6IFtcbiAgICAgICAgICAgICcqKi8qLntqcyxodG1sLHdlYm1hbmlmZXN0fScsXG4gICAgICAgICAgICAnKiovKi57c3ZnLHBuZyxqcGcsZ2lmfScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICAgIGluamVjdFJlZ2lzdGVyOiAnYXV0bycsXG4gICAgICB9KSxcbiAgICAgIGxpZ2h0bmluZ2Nzcyh7XG4gICAgICAgIGJyb3dzZXJzbGlzdDogJ2xhc3QgMiB2ZXJzaW9ucywgbm90IGRlYWQsID4wLjIlLCBpZSAxMScsXG4gICAgICAgIHNvdXJjZU1hcDogaXNEZXYsXG4gICAgICAgIG1pbmlmeTogIWlzRGV2LFxuICAgICAgfSksXG4gICAgICBta2NlcnQoKSxcbiAgICBdLFxuICAgIHByZXZpZXc6IHtcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBjb3JzOiBmYWxzZSxcbiAgICAgIGh0dHBzOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gVGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBjb3JzOiBmYWxzZSxcbiAgICAgIGh0dHBzOiB0cnVlLFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiByZXNvbHZlRGlyYHNyY2AsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX0FQUF9FTlZfXzogSlNPTi5zdHJpbmdpZnkoZW52KSxcbiAgICB9LFxuICAgIC8vIH0sXG4gICAgLy8gdG8gbWFrZSB1c2Ugb2YgYFRBVVJJX1BMQVRGT1JNYCwgYFRBVVJJX0FSQ0hgLCBgVEFVUklfRkFNSUxZYCxcbiAgICAvLyBgVEFVUklfUExBVEZPUk1fVkVSU0lPTmAsIGBUQVVSSV9QTEFURk9STV9UWVBFYCBhbmQgYFRBVVJJX0RFQlVHYFxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgZXNtRXh0ZXJuYWxzOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gZXNidWlsZDoge1xuICAgIGpzeEluamVjdDogYGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdgLFxuICAgIC8vIGVudiB2YXJpYWJsZXNcbiAgICBlbnZQcmVmaXg6IFsnVklURV8nLCAnVEFVUklfJ10sXG4gICAgLy8gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwYyxTQUFTLGNBQWMsZUFBZTtBQUNoZixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGtCQUFrQjtBQUN6QixTQUFTLGVBQWU7QUFMeEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTSxhQUFhLENBQUMsUUFBOEIsUUFBUSxrQ0FBVyxHQUFHLEdBQUc7QUFFM0UsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxRQUFNLFFBQVEsU0FBUztBQUV2QixTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixjQUFjO0FBQUEsY0FDWjtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFlBQ0EsUUFBUSxDQUFDLG1CQUFtQiw4QkFBOEI7QUFBQSxZQUMxRCxVQUFVLENBQUMsNEJBQTRCO0FBQUEsWUFDdkMsT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFlBQzVCLE9BQU8sQ0FBQyxpQkFBaUI7QUFBQSxVQUMzQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFFBQVEsSUFBSSxtQkFBbUIsWUFBWSxjQUFjO0FBQUEsTUFDekQsV0FBVyxRQUFRLFFBQVE7QUFBQTtBQUFBLE1BRTNCLFFBQVEsUUFBUSxRQUFRO0FBQUE7QUFBQSxNQUV4QixXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sVUFBVTtBQUFBLFVBQ1IsYUFBYTtBQUFBLFVBQ2IsWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2IsTUFBTTtBQUFBLFVBQ04sYUFBYTtBQUFBLFVBQ2IsSUFBSTtBQUFBLFFBQ047QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLGNBQWM7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxjQUFjO0FBQUEsUUFDZCxnQkFBZ0I7QUFBQSxNQUNsQixDQUFDO0FBQUEsTUFDRCxhQUFhO0FBQUEsUUFDWCxjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsUUFDWCxRQUFRLENBQUM7QUFBQSxNQUNYLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixhQUFhLEtBQUssVUFBVSxHQUFHO0FBQUEsSUFDakM7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLGlCQUFpQjtBQUFBLE1BQ2YsY0FBYztBQUFBLElBQ2hCO0FBQUE7QUFBQSxJQUVBLFdBQVc7QUFBQTtBQUFBLElBRVgsV0FBVyxDQUFDLFNBQVMsUUFBUTtBQUFBO0FBQUEsSUFFN0IsYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
