import App from '@/app'
import Layout from '@/pages/Layout'
import { constant } from 'fp-ts/function'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={constant(import('@/pages'))} />
      <Route lazy={constant(import('@/pages/Upload'))} path="upload" />
      <Route
        lazy={constant(import('@/pages/ColumnMatching'))}
        path="column-matching"
      />
      <Route lazy={constant(import('@/pages/EDA'))} path="EDA">
        <Route path=":column">
          <Route index lazy={constant(import('@/pages/EDA/Variable'))} />
          <Route
            lazy={constant(import('@/pages/EDA/Variable'))}
            path=":visit"
          />
        </Route>
      </Route>
      <Route lazy={constant(import('@/pages/Download'))} path="download" />
    </Route>
    <Route lazy={constant(import('@/pages/404'))} path="*" />
  </Route>,
)

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})
