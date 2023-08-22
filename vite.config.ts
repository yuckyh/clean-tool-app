import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import lightningcss from 'vite-plugin-lightningcss'
import { resolve } from 'path'
import { webManifest } from './package.json'

const resolveDir = (dir: TemplateStringsArray) => resolve(__dirname, ...dir)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'

  return {
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**\/*.{js,css,html,ico,png,svg}'],
        },
        manifest: webManifest,
      }),
      lightningcss({
        minify: !isDev,
        sourceMap: isDev,
        browserslist: 'last 2 versions, not dead, >0.2%, ie 11',
      }),
    ],
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      cors: false,
    },
    preview: {
      strictPort: true,
      cors: false,
    },
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: isDev ? false : 'esbuild',
      // produce sourcemaps for debug builds
      sourcemap: isDev,
      cssMinify: isDev ? false : 'lightningcss',
    },
    resolve: {
      alias: {
        '@': resolveDir`src`,
      },
    },
  }
})
