/**
 * @file This file is used as the application route definition.
 */

import type { RouterProviderProps } from 'react-router-dom'

import App from '@/app'
import { lazyComponentImport } from '@/lib/utils'
import Layout from '@/pages/Layout'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

/**
 * The application routes defined using JSX.
 *
 * For lazy loading, it is recommended to default export the component and use the {@link lazyComponentImport  `lazyComponentImport`} helper, as there are no use of the data fetching api from `react-router`.
 */
export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={lazyComponentImport('../pages')} />
      <Route lazy={lazyComponentImport('../pages/Upload')} path="upload" />
      <Route
        lazy={lazyComponentImport('../pages/ColumnMatching')}
        path="column-matching"
      />
      <Route lazy={lazyComponentImport('../pages/EDA')} path="EDA">
        <Route path=":column">
          <Route index lazy={lazyComponentImport('../pages/EDA/Variable')} />
          <Route
            lazy={lazyComponentImport('../pages/EDA/Variable')}
            path=":visit"
          />
        </Route>
      </Route>
      <Route lazy={lazyComponentImport('../pages/Download')} path="download" />
    </Route>
    <Route lazy={lazyComponentImport('../pages/NotFound')} path="*" />
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
