import { createRoot } from 'react-dom/client'
import App from './App'
import { StrictMode } from 'react'

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
