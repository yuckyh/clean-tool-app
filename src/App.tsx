import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { FluentProvider, Spinner } from '@fluentui/react-components'
import { webLightTheme, webDarkTheme } from '@fluentui/react-components'

import { router } from '@/router'
import ApplyToBody from '@/components/ApplyToBody'
import '@/App.css'

const App = () => {
  const [darkPreference, setDarkPreference] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

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
      <ApplyToBody />
      <RouterProvider
        router={router}
        fallbackElement={<Spinner appearance="primary" size="large" />}
        future={{ v7_startTransition: true }}
      />
    </FluentProvider>
  )
}

export default App
