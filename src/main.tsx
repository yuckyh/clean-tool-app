import { createRoot } from 'react-dom/client'
import App from './App'

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)
root.render(<App />)
