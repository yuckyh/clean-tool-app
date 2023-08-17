import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  makeStaticStyles,
} from '@fluentui/react-components'

import ApplyToBody from '@/components/ApplyToBody'
import styleString from '@/global.css?inline'
import { author, description, keywords } from '@/../package.json'

const useGlobalStyles = makeStaticStyles(styleString)

const App = () => {
  const [darkPreference, setDarkPreference] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useGlobalStyles()

  useEffect(() => {
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setDarkPreference(e.matches)
    }

    themeMedia.addEventListener('change', handleThemeChange)

    return () => {
      themeMedia.removeEventListener('change', handleThemeChange)
    }
  }, [darkPreference, setDarkPreference])

  return (
    <FluentProvider theme={darkPreference ? webDarkTheme : webLightTheme}>
      <Helmet titleTemplate="%s - CLEaN Tool" defaultTitle="CLEaN Tool">
        <meta name="author" content={author.name} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(',')} />
      </Helmet>
      <ApplyToBody />
      <Outlet />
    </FluentProvider>
  )
}

export default App
