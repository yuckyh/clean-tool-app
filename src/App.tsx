import { createRoot } from 'react-dom/client'
import { useState, StrictMode } from 'react'
import { FluentProvider } from '@fluentui/react-components'
import { webLightTheme, webDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'
import ApplyToBody from './components/ApplyToBody'
import 'modern-normalize'
import './App.css'

const appTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme

const App = () => {
  const [count, setCount] = useState(0)

  return <StrictMode>
    <FluentProvider theme={appTheme}>
      <ApplyToBody />

      <div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => { setCount((count) => count + 1); }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

    </FluentProvider>
  </StrictMode>
}

createRoot(document.getElementById('root') ?? document.createElement('div')).render(<App />)

export default App