import { Outlet } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { makeStaticStyles } from '@fluentui/react-components'

import styleString from '@/global.css?inline'
import { author, description, keywords } from '@/../package.json'
import { usePathTitle } from '@/hooks'
import GlobalFluentProvider from './components/GlobalFluentProvider'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'

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
      <HelmetProvider>
        <Helmet
          titleTemplate="%s - CLEaN Tool"
          defaultTitle="CLEaN Tool"
          prioritizeSeoTags>
          <meta name="author" content={author.name} />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords.join(',')} />
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <Outlet />
    </GlobalFluentProvider>
  )
}

export default App
