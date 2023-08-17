import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

import { router } from '@/router'
import { Spinner } from '@fluentui/react-components'

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
    <RouterProvider
      router={router}
      fallbackElement={<Spinner appearance="primary" size="large" />}
      future={{ v7_startTransition: true }}
    />
  </StrictMode>,
)
