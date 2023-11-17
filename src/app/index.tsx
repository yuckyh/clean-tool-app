/**
 * @file This file contains the main app component.
 * @module app
 */

import { author, description, keywords } from '@/../package.json'
import store from '@/app/store'
import { asIO } from '@/lib/fp'
import { ioDump } from '@/lib/fp/logger'
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { useMemo, useSyncExternalStore } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { useGlobalStyles, useStorage } from './selectors'

/**
 *
 * @param dark
 * @param light
 * @example
 * @example
 */
export const useThemePreference = (
  dark = webDarkTheme,
  light = webLightTheme,
) => {
  const themeMedia = useMemo(
    () => matchMedia('(prefers-color-scheme: dark)'),
    [],
  )

  const theme = useSyncExternalStore(
    (cb) => {
      themeMedia.addEventListener('change', cb)
      return asIO(() => {
        themeMedia.removeEventListener('change', cb)
      })
    },
    () => themeMedia.matches,
  )

  return theme ? dark : light
}

/**
 * This is the second entry point of the application.
 * This is to be used inside the router.
 * @category Component
 * @returns The main app component
 * @example
 * ```tsx
 *  <Route element={<App />} />
 * ```
 */
export default function App() {
  useGlobalStyles()
  useStorage()
  useRegisterSW({
    immediate: true,
    onOfflineReady: ioDump('offline ready'),
  })

  return (
    <Provider store={store}>
      <FluentProvider theme={useThemePreference()}>
        <HelmetProvider>
          <Helmet
            defaultTitle="CLEaN Tool"
            prioritizeSeoTags
            titleTemplate="%s - CLEaN Tool">
            <meta content={author.name} name="author" />
            <meta content={description} name="description" />
            <meta content={keywords.join(',')} name="keywords" />
          </Helmet>
          <Outlet />
        </HelmetProvider>
      </FluentProvider>
    </Provider>
  )
}
