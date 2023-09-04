import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Spinner } from '@fluentui/react-components'

import { router } from '@/Router'

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
