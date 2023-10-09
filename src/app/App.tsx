import {
  makeStaticStyles,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  makeStyles,
  shorthands,
  Subtitle1,
  Spinner,
  tokens,
} from '@fluentui/react-components'
import { useSyncExternalStore, useEffect, useState, useMemo } from 'react'
import ProgressNav from '@/features/progress/components/ProgressNav'
import { description, keywords, author } from '@/../package.json'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useNavigation, Outlet } from 'react-router-dom'
import globalStyles from '@/app/global.css?inline'
import Loader from '@/components/Loader'
import { Provider } from 'react-redux'
import store from '@/app/store'

const useGlobalStyles = makeStaticStyles(globalStyles)

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

const useClasses = makeStyles({
  main: {
    flexDirection: 'column',
    display: 'flex',
    ...shorthands.padding(tokens.spacingVerticalXXXL),
  },
  header: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
  },
})

const App = () => {
  useGlobalStyles()
  const classes = useClasses()

  const navigation = useNavigation()
  const theme = useThemePreference()

  useEffect(() => {
    void navigator.storage.persisted().then((persisted) => {
      persisted && void navigator.storage.persist()
    })
  }, [])

  const loading = useMemo(
    () => navigation.state === 'loading',
    [navigation.state],
  )

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
          <header className={classes.header}>
            <ProgressNav thickness="large" />
          </header>
          <main className={classes.main}>
            <Loader
              label={<Subtitle1>Loading...</Subtitle1>}
              labelPosition="below"
              size="huge">
              {loading ? (
                <Spinner
                  label={<Subtitle1>Loading...</Subtitle1>}
                  labelPosition="below"
                  size="huge"
                />
              ) : (
                <Outlet />
              )}
            </Loader>
          </main>
        </HelmetProvider>
      </FluentProvider>
    </Provider>
  )
}

export default App
