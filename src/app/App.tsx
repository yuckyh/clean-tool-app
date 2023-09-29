import { author, description, keywords } from '@/../package.json'
import styleString from '@/app/global.css?inline'
import store from '@/app/store'
import { useAsyncEffect } from '@/lib/hooks'
import { usePathTitle } from '@/lib/string'
import { just } from '@/lib/utils'
import {
  FluentProvider,
  makeStaticStyles,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { lazy, useState, useSyncExternalStore } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

const useGlobalStyles = makeStaticStyles(styleString)

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
  const title = usePathTitle()
  const theme = useThemePreference()

  useGlobalStyles()
  useAsyncEffect(async () => {
    ;(await navigator.storage.persisted()) &&
      (await navigator.storage.persist())
  }, [])

  useRegisterSW({
    immediate: true,
    onOfflineReady: () => {
      just('offline ready')(console.log)
    },
  })

  return (
    <Provider store={store}>
      <FluentProvider theme={theme}>
        <HelmetProvider>
          <Helmet
            defaultTitle="CLEaN Tool"
            prioritizeSeoTags
            titleTemplate="%s - CLEaN Tool">
            <meta content={author.name} name="author" />
            <meta content={description} name="description" />
            <meta content={keywords.join(',')} name="keywords" />
            <title>{title}</title>
          </Helmet>
        </HelmetProvider>
        <Layout>
          <Outlet />
        </Layout>
      </FluentProvider>
    </Provider>
  )
}

export default App
