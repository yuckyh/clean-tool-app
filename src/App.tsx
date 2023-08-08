import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { FluentProvider } from '@fluentui/react-components'
import { webLightTheme, webDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'

import {router} from './router'
import ApplyToBody from './components/ApplyToBody'
import './App.css'
import Layout from './Layout'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? webDarkTheme
  : webLightTheme

const App = () => {
  return (
    <StrictMode>
      <FluentProvider theme={appTheme}>
        <RouterProvider router={router} />
        <ApplyToBody />
      </FluentProvider>
    </StrictMode>
  )
}

export default App
