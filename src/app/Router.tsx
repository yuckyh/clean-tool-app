/**
 * @file This file contains the router configuration.
 * @module app/Router
 */

import type { RouterProviderProps } from 'react-router-dom'

import App from '@/app'
import { defaultLazyComponent } from '@/lib/utils'
import Layout from '@/pages/Layout'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

/**
 * The application routes defined using JSX.
 *
 * For lazy loading, it is recommended to default export the component and use the {@link defaultLazyComponent  `defaultLazyComponent`} helper, as there are no use of the data fetching api from `react-router`.
 */
export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={defaultLazyComponent(import('../pages'))} />
      <Route
        lazy={defaultLazyComponent(import('../pages/Upload'))}
        path="upload"
      />
      <Route
        lazy={defaultLazyComponent(import('../pages/ColumnMatching'))}
        path="column-matching"
      />
      <Route lazy={defaultLazyComponent(import('../pages/EDA'))} path="EDA">
        <Route path=":column">
          <Route
            index
            lazy={defaultLazyComponent(import('../pages/EDA/Variable'))}
          />
          <Route
            lazy={defaultLazyComponent(import('../pages/EDA/Variable'))}
            path=":visit"
          />
        </Route>
      </Route>
      <Route
        lazy={defaultLazyComponent(import('../pages/Download'))}
        path="download"
      />
    </Route>
    <Route lazy={defaultLazyComponent(import('../pages/NotFound'))} path="*" />
  </Route>,
)

/**
 * The application router instance.
 *
 * This is used in the {@link https://reactrouter.com/en/main/routers/router-provider `RouterProvider`} in the main entry point of the application.
 */
export const router: Readonly<RouterProviderProps['router']> =
  createBrowserRouter(routes, {
    future: {
      v7_normalizeFormMethod: true,
    },
  } as const)
