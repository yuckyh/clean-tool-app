import App from '@/App'
import Layout from '@/Layout'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={() => import('@/pages')} />
      <Route lazy={() => import('@/pages/Upload')} path="upload" />
      <Route
        lazy={() => import('@/pages/ColumnMatching')}
        path="column-matching"
      />
      <Route lazy={() => import('@/pages/EDA')} path="EDA">
        <Route lazy={() => import('@/pages/EDA/Variable')} path=":variable" />
      </Route>
      <Route lazy={() => import('@/pages/Download')} path="download" />
    </Route>
    <Route lazy={() => import('@/404')} path="*" />
  </Route>,
)

const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})

export { router, routes }
