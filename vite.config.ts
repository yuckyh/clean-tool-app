import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'
import lightningcss from 'vite-plugin-lightningcss'
import { resolve } from 'path'

import manifest from './manifest.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: true,
        },
        workbox: {
          cleanupOutdatedCaches: false,
          sourcemap: !!env.TAURI_DEBUG,
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        manifest,
      }),
      lightningcss({
        browserslist: 'last 2 versions',
        sourceMap: env.NODE_ENV === 'development',
        minify: env.NODE_ENV === 'production',
      }),
      basicSsl(),
    ],
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      cors: false,
      https: true,
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
      minify: env.TAURI_DEBUG ? false : 'esbuild',
      // produce sourcemaps for debug builds
      sourcemap: !!env.TAURI_DEBUG,
      cssMinify: env.TAURI_DEBUG ? false : 'lightningcss',
    },
    // css: {
    //   transformer: 'lightningcss',
    // },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
