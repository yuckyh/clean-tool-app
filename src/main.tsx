import { router } from '@/app/Router'
import { Spinner } from '@fluentui/react-components'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const id = 'root'
const rootDOM =
  document.getElementById(id) ??
  document.body.appendChild(
    Object.assign(document.createElement('div'), { id }),
  )
const root = createRoot(rootDOM)

root.render(
  <RouterProvider
    fallbackElement={<Spinner size="huge" />}
    future={{ v7_startTransition: true }}
    router={router}
  />,
)
