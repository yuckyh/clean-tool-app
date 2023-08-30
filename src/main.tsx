import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Spinner } from '@fluentui/react-components'
import { registerSW } from 'virtual:pwa-register'

import { router } from '@/Router'

// const intervalMS = 60 * 60 * 1000

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('offline ready')
  },
  // onRegistered(r) {
  //   r &&
  //     setInterval(() => {
  //       void r.update()
  //     }, intervalMS)
  // },
})

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)

root.render(
  <StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<Spinner appearance="primary" size="huge" />}
      future={{ v7_startTransition: true }}
    />
  </StrictMode>,
)
