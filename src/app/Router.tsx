import App from '@/app'
import Layout from '@/pages/Layout'
import * as f from 'fp-ts/function'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={f.constant(import('@/pages'))} />
      <Route lazy={f.constant(import('@/pages/Upload'))} path="upload" />
      <Route
        lazy={f.constant(import('@/pages/ColumnMatching'))}
        path="column-matching"
      />
      <Route lazy={f.constant(import('@/pages/EDA'))} path="EDA">
        <Route path=":column">
          <Route index lazy={f.constant(import('@/pages/EDA/Variable'))} />
          <Route
            lazy={f.constant(import('@/pages/EDA/Variable'))}
            path=":visit"
          />
        </Route>
      </Route>
      <Route lazy={f.constant(import('@/pages/Download'))} path="download" />
    </Route>
    <Route lazy={f.constant(import('@/pages/404'))} path="*" />
  </Route>,
)

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})
