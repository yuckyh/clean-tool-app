import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import lightningcss from 'vite-plugin-lightningcss'
import { resolve } from 'path'

const resolveDir = (dir: TemplateStringsArray) => resolve(__dirname, ...dir)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            reactHelpers: [
              'react-helmet-async',
              'react-router-dom',
              'react-dropzone',
            ],
            plotly: ['react-plotly.js', 'plotly.js-cartesian-dist-min'],
            fluentui: ['@fluentui/react-components'],
            react: ['react', 'react-dom'],
            tauri: ['@tauri-apps/api'],
          },
        },
      },
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      cssMinify: isDev ? false : 'lightningcss',
      // don't minify for debug builds
      minify: isDev ? false : 'esbuild',
      // produce sourcemaps for debug builds
      sourcemap: isDev,
    },
    plugins: [
      react(),
      VitePWA({
        manifest: {
          description: 'A clean tool app for Essilor',
          short_name: 'CleanToolApp',
          orientation: 'landscape',
          name: 'CLEaN Tool App',
          theme_color: '#0F6CBD',
          id: '/',
        },
        workbox: {
          globPatterns: [
            '**/*.{js,html,webmanifest}',
            '**/*.{svg,png,jpg,gif}',
          ],
        },
        registerType: 'autoUpdate',
        injectRegister: 'auto',
      }),
      lightningcss({
        browserslist: 'last 2 versions, not dead, >0.2%, ie 11',
        sourceMap: isDev,
        minify: !isDev,
      }),
      mkcert(),
    ],
    preview: {
      strictPort: true,
      cors: false,
      https: true,
    },
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      cors: false,
      https: true,
    },
    resolve: {
      alias: {
        '@': resolveDir`src`,
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    // },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    commonjsOptions: {
      esmExternals: true,
    },
    // esbuild: {
    jsxInject: `import React from 'react'`,
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    // prevent vite from obscuring rust errors
    clearScreen: false,
  }
})
