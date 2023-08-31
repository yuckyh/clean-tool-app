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
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: isDev,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        manifest: {
          id: '/',
          name: 'CLEaN Tool App',
          short_name: 'CleanToolApp',
          description: 'A clean tool app for Essilor',
          theme_color: '#0F6CBD',
          orientation: 'landscape',
        },
      }),
      lightningcss({
        minify: !isDev,
        sourceMap: isDev,
        browserslist: 'last 2 versions, not dead, >0.2%, ie 11',
      }),
      mkcert(),
    ],
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      cors: false,
      https: true,
    },
    preview: {
      strictPort: true,
      cors: false,
      https: true,
    },
    // esbuild: {
    jsxInject: `import React from 'react'`,
    // },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    commonjsOptions: {
      esmExternals: true,
    },
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: isDev ? false : 'esbuild',
      // produce sourcemaps for debug builds
      sourcemap: isDev,
      cssMinify: isDev ? false : 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            reactHelpers: [
              'react-helmet',
              'react-router-dom',
              'react-dropzone',
            ],
            fluentui: ['@fluentui/react-components'],
            tauri: ['@tauri-apps/api'],
            plotly: ['react-plotly.js', 'plotly.js'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': resolveDir`src`,
      },
    },
  }
})
