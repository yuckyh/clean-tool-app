import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import App from '@/App'
import Layout from '@/Layout'
import NotFound from '@/404'
import Home from '@/pages'
import Variable from '@/pages/EDA/Variable'

import { progressStorage, ProgressState } from '@/lib/ProgressStorage'

const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="upload" lazy={() => import('@/pages/Upload')} />
      <Route
        path="column-matching"
        action={(args) => {
          console.log(args)
          progressStorage.state = ProgressState.UPLOADED
          return { status: 200 }
        }}
        lazy={() => import('@/pages/ColumnMatching')}
      />
      <Route path="EDA" lazy={() => import('@/pages/EDA')}>
        <Route path=":variable" element={<Variable />} />
      </Route>
      <Route path="download" lazy={() => import('@/pages/Download')} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Route>,
)

const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})

export { router, routes }
