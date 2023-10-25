import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import lightningcss from 'vite-plugin-lightningcss'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

const resolveDir = (dir: TemplateStringsArray) => resolve(__dirname, ...dir)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'

  return {
    build: {
      cssMinify: isDev ? false : 'lightningcss',
      // don't minify for debug builds
      // minify: isDev ? false : 'esbuild',
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: {
            fluentui: ['@fluentui/react-components'],
            // plotly: ['plotly.js-cartesian-dist'],
            react: ['react', 'react-dom'],
            reactHelpers: [
              'react-helmet-async',
              'react-router-dom',
              'react-dropzone',
              'react-redux',
            ],
            tauri: ['@tauri-apps/api', '@tauri-apps/cli'],
          },
        },
      },
      // produce sourcemaps for debug builds
      sourcemap: isDev,
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    },
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    commonjsOptions: {
      esmExternals: true,
    },
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    // esbuild: {
    jsxInject: `import React from 'react'`,
    // },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    plugins: [
      react(),
      VitePWA({
        injectRegister: 'auto',
        manifest: {
          description: 'A clean tool app for Essilor',
          id: '/',
          name: 'CLEaN Tool App',
          orientation: 'landscape',
          short_name: 'CleanToolApp',
          theme_color: '#0F6CBD',
        },
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: [
            '**/*.{js,html,webmanifest}',
            '**/*.{svg,png,jpg,gif}',
          ],
        },
      }),
      lightningcss({
        browserslist: 'last 2 versions, not dead, >0.2%, ie 11',
        minify: !isDev,
        sourceMap: isDev,
      }),
      mkcert(),
    ],
    preview: {
      cors: false,
      https: true,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': resolveDir`src`,
      },
    },
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      cors: false,
      https: true,
      strictPort: true,
    },
  }
})
