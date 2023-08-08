import { StrictMode } from 'react'
import { FluentProvider } from '@fluentui/react-components'
import { webLightTheme, webDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'
import ApplyToBody from './components/ApplyToBody'
import './App.css'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? webDarkTheme
  : webLightTheme

const App = () => {
  return (
    <StrictMode>
      <FluentProvider theme={appTheme}>
        <ApplyToBody />
        bruh
      </FluentProvider>
    </StrictMode>
  )
}

export default App
