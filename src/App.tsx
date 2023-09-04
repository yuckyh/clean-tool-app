import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { makeStaticStyles } from '@fluentui/react-components'

import styleString from '@/global.css?inline'
import { author, description, keywords } from '@/../package.json'
import { useOPFS, usePathTitle } from '@/hooks'
import GlobalFluentProvider from './components/GlobalFluentProvider'
import { useRegisterSW } from 'virtual:pwa-register/react'

const useGlobalStyles = makeStaticStyles(styleString)

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
      <Helmet titleTemplate="%s - CLEaN Tool" defaultTitle="CLEaN Tool">
        <meta name="author" content={author.name} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(',')} />
        <title>{title}</title>
      </Helmet>
      <Outlet />
    </GlobalFluentProvider>
  )
}

export default App
