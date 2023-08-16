import { createRoot } from 'react-dom/client'
import App from '@/App'
import { StrictMode } from 'react'
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('offline ready')
  },
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update()
      }, intervalMS)
  },
})

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
