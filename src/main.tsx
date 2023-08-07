import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'
import ApplyToBody from './ApplyToBody'
import App from './App'
import './index.css'
import 'modern-normalize'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme

createRoot(document.getElementById('root') ?? document.createElement('div')).render(
  <StrictMode>
    <FluentProvider theme={appTheme}>
      <ApplyToBody />
      <App />
    </FluentProvider>
  </StrictMode>,
)
