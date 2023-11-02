import App from '@/app'
import { asTask } from '@/lib/fp'
import Layout from '@/pages/Layout'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

/**
 * A helper function to import a component lazily from its default export.
 * @public
 * @template T - The component's prop type
 * @param path - Path to the component
 * @returns A {@link https://gcanti.github.io/fp-ts/modules/Task.ts.html `Task`} that resolves the default export of the component which can be used by the {@link https://reactrouter.com/en/main/route/lazy `lazy`} property for a route.
 */
export function lazyComponentImport<T>(path: string) {
  return asTask(async () => ({
    Component: (
      await (import(path) as Promise<{ default: React.ComponentType<T> }>)
    ).default,
  }))
}

/**
 * The application routes defined using JSX.
 *
 * Most of the routes are lazy loaded using the {@link lazyComponentImport | `lazyComponentImport`} helper.
 */
export const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index lazy={lazyComponentImport('@/pages')} />
      <Route lazy={lazyComponentImport('@/pages/Upload')} path="upload" />
      <Route
        lazy={lazyComponentImport('@/pages/ColumnMatching')}
        path="column-matching"
      />
      <Route lazy={lazyComponentImport('@/pages/EDA')} path="EDA">
        <Route path=":column">
          <Route index lazy={lazyComponentImport('@/pages/EDA/Variable')} />
          <Route
            lazy={lazyComponentImport('@/pages/EDA/Variable')}
            path=":visit"
          />
        </Route>
      </Route>
      <Route lazy={lazyComponentImport('@/pages/Download')} path="download" />
    </Route>
    <Route lazy={lazyComponentImport('@/pages/NotFound')} path="*" />
  </Route>,
)

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
} as const)
