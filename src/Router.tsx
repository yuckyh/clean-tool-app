import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import App from '@/App'
import Layout from '@/Layout'

const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={() => import('@/pages')} />
      <Route path="upload" lazy={() => import('@/pages/Upload')} />
      <Route
        path="column-matching"
        lazy={() => import('@/pages/ColumnMatching')}
      />
      <Route path="EDA" lazy={() => import('@/pages/EDA')}>
        <Route path=":variable" lazy={() => import('@/pages/EDA/Variable')} />
      </Route>
      <Route path="download" lazy={() => import('@/pages/Download')} />
    </Route>
    <Route path="*" lazy={() => import('@/404')} />
  </Route>,
)

const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})

export { router, routes }
