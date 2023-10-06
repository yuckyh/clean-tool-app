import {
  makeStaticStyles,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components'
import { description, keywords, author } from '@/../package.json'
import { useSyncExternalStore, useState, lazy } from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useRegisterSW } from 'virtual:pwa-register/react'
import globalStyles from '@/app/global.css?inline'
import { useAsyncEffect } from '@/lib/hooks'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { just } from '@/lib/utils'
import store from '@/app/store'

const useGlobalStyles = makeStaticStyles(globalStyles)

const Layout = just(() => import('@/app/Layout'))(lazy)()

const useThemePreference = (dark = webDarkTheme, light = webLightTheme) => {
  const [themeMedia] = useState(matchMedia('(prefers-color-scheme: dark)'))

  return useSyncExternalStore(
    (cb) => {
      themeMedia.addEventListener('change', cb)
      return () => {
        themeMedia.removeEventListener('change', cb)
      }
    },
    () => themeMedia.matches,
  )
    ? dark
    : light
}

const App = () => {
  const theme = useThemePreference()

  useGlobalStyles()
  useAsyncEffect(async () => {
    ;(await navigator.storage.persisted()) &&
      (await navigator.storage.persist())
  }, [])

  useRegisterSW({
    onOfflineReady: () => {
      just('offline ready')(console.log)
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
          <Layout>
            <Outlet />
          </Layout>
        </HelmetProvider>
      </FluentProvider>
    </Provider>
  )
}

export default App
