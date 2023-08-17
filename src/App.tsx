import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  makeStaticStyles,
  useThemeClassName,
} from '@fluentui/react-components'

import styleString from '@/global.css?inline'
import { author, description, keywords } from '@/../package.json'
import { useCurrentRoute, useRouteName } from '@/hooks'

const useGlobalStyles = makeStaticStyles(styleString)

const App = () => {
  const [darkPreference, setDarkPreference] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  const currentRoute = useCurrentRoute()
  const title = useRouteName(currentRoute!)

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
        <title>{title}</title>
      </Helmet>
      <ApplyToBody />
      <Outlet />
    </FluentProvider>
  )
}

const ApplyToBody = () => {
  const classes = useThemeClassName()

  useEffect(() => {
    const classList = classes.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  }, [classes])

  return <></>
}

export default App
