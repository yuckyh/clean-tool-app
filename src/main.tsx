import { Spinner } from '@fluentui/react-components'
import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { router } from '@/app/Router'
import { StrictMode } from 'react'

const id = 'root'
const rootDOM =
  document.getElementById(id) ??
  document.body.appendChild(
    Object.assign(document.createElement('div'), { id }),
  )
const root = createRoot(rootDOM)

// root.render(
//   <StrictMode>
//     <RouterProvider
//       fallbackElement={<Spinner size="huge" />}
//       future={{ v7_startTransition: true }}
//       router={router}
//     />
//   </StrictMode>,
// )

root.render(
  <RouterProvider
    fallbackElement={<Spinner size="huge" />}
    future={{ v7_startTransition: true }}
    router={router}
  />,
)
