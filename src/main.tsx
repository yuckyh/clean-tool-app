import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'modern-normalize'
import type { Theme } from '@fluentui/react-components'
import { FluentProvider, webLightTheme, webDarkTheme, useThemeClassName } from '@fluentui/react-components'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme

function ApplyToBody() {
  const classes = useThemeClassName();

  React.useEffect(() => {
    const classList = classes.split(" ");
    document.body.classList.add(...classList);

    return () => document.body.classList.remove(...classList);
  }, [classes]);

  return null;
}

ReactDOM.createRoot(document.querySelector('body')!).render(
  <React.StrictMode>
    <FluentProvider theme={appTheme}>
      <ApplyToBody />
      <App />
    </FluentProvider>
  </React.StrictMode>,
)
