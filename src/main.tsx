import { router } from '@/Router'
import { Spinner } from '@fluentui/react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const rootDOM = document.getElementById('root') ?? document.createElement('div')
const root = createRoot(rootDOM)

root.render(
  <StrictMode>
    <RouterProvider
      fallbackElement={<Spinner size="huge" />}
      future={{ v7_startTransition: true }}
      router={router}
    />
  </StrictMode>,
)
