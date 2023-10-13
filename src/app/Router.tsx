import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from 'react-router-dom'
import Layout from '@/pages/Layout'
import App from '@/app'

export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route lazy={() => import('@/pages')} index />
      <Route lazy={() => import('@/pages/Upload')} path="upload" />
      <Route
        lazy={() => import('@/pages/ColumnMatching')}
        path="column-matching"
      />
      <Route lazy={() => import('@/pages/EDA')} path="EDA">
        <Route path=":column">
          <Route lazy={() => import('@/pages/EDA/Variable')} index />
          <Route lazy={() => import('@/pages/EDA/Variable')} path=":visit" />
        </Route>
      </Route>
      <Route lazy={() => import('@/pages/Download')} path="download" />
    </Route>
    <Route lazy={() => import('@/pages/404')} path="*" />
  </Route>,
)

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})
