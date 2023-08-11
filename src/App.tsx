import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { FluentProvider, Spinner } from '@fluentui/react-components'
import { webLightTheme, webDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'

import { router } from './router'
import ApplyToBody from '@/components/ApplyToBody'
import './App.css'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? webDarkTheme
  : webLightTheme

const App = () => (
  <StrictMode>
    <FluentProvider theme={appTheme}>
      <ApplyToBody />
      <RouterProvider
        router={router}
        fallbackElement={<Spinner appearance="primary" size="large" />}
        future={{ v7_startTransition: true }}
      />
    </FluentProvider>
  </StrictMode>
)

export default App
