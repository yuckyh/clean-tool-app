import { createRoot } from 'react-dom/client'
import App from './App'

console.log(import.meta.env)

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)
root.render(<App />)