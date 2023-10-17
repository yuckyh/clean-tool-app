import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from 'react-router-dom'
import { constant } from 'fp-ts/function'
import Layout from '@/pages/Layout'
import App from '@/app'

export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route lazy={constant(import('@/pages'))} index />
      <Route lazy={constant(import('@/pages/Upload'))} path="upload" />
      <Route
        lazy={constant(import('@/pages/ColumnMatching'))}
        path="column-matching"
      />
      <Route lazy={constant(import('@/pages/EDA'))} path="EDA">
        <Route path=":column">
          <Route lazy={constant(import('@/pages/EDA/Variable'))} index />
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
