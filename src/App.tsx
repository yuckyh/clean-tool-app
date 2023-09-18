import { author, description, keywords } from '@/../package.json'
import GlobalFluentProvider from '@/components/GlobalFluentProvider'
import styleString from '@/global.css?inline'
import { usePathTitle } from '@/hooks'
import store from '@/store'
import { makeStaticStyles } from '@fluentui/react-components'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

const useGlobalStyles = makeStaticStyles(styleString)

const useOPFS = () => {
  useEffect(() => {
    void (async () =>
      (await navigator.storage.persisted()) &&
      (await navigator.storage.persist()))()
  }, [])
}

const App = () => {
  const title = usePathTitle()

  useGlobalStyles()
  useOPFS()

  useRegisterSW({
    immediate: true,
    onOfflineReady: () => {
      console.log('offline ready')
    },
  })

  return (
    <GlobalFluentProvider>
      <Provider store={store}>
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
        <Outlet />
      </Provider>
    </GlobalFluentProvider>
  )
}

export default App
