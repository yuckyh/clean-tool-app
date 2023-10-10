import {
  makeStaticStyles,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components'
import { description, keywords, author } from '@/../package.json'
import { useSyncExternalStore, useEffect, useMemo } from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useRegisterSW } from 'virtual:pwa-register/react'
import globalStyles from '@/app/global.css?inline'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/app/store'

const useGlobalStyles = makeStaticStyles(globalStyles)

const useThemePreference = (dark = webDarkTheme, light = webLightTheme) => {
  const themeMedia = useMemo(
    () => matchMedia('(prefers-color-scheme: dark)'),
    [],
  )

  const theme = useSyncExternalStore(
    (cb) => {
      themeMedia.addEventListener('change', cb)
      return () => {
        themeMedia.removeEventListener('change', cb)
      }
    },
    () => themeMedia.matches,
  )

  return theme ? dark : light
}

const App = () => {
  useGlobalStyles()
  const theme = useThemePreference()

  useEffect(() => {
    void navigator.storage
      .persisted()
      .then((persisted) => persisted && void navigator.storage.persist())
  }, [])

  useRegisterSW({
    onOfflineReady: () => {
      console.log('offline ready')
    },
    immediate: true,
  })

  return (
    <Provider store={store}>
      <FluentProvider theme={theme}>
        <HelmetProvider>
          <Helmet
            titleTemplate="%s - CLEaN Tool"
            defaultTitle="CLEaN Tool"
            prioritizeSeoTags>
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

export default App
