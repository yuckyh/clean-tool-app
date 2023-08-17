import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import App from '@/App'
import Layout from '@/Layout'
import NotFound from '@/pages/404'

import Home from '@/pages/Home'
import Upload from '@/pages/Upload'
import EDA from '@/pages/EDA'
import Variable from '@/pages/EDA/Variable'
import Download from '@/pages/Download'

import { navHandle, progressNavHandle } from './handlers'
import ColumnMatching from '@/pages/ColumnMatching'

const routes = createRoutesFromElements(
  <>
    <Route element={<App />}>
      <Route element={<Layout />} handle={progressNavHandle}>
        <Route index element={<Home />} />
        <Route path="column-matching" element={<ColumnMatching />}></Route>
        <Route path="upload" element={<Upload />} />
        <Route path="eda" element={<EDA />} handle={navHandle}>
          <Route path="variable1" element={<Variable key={1} />} />
          <Route path="variable2" element={<Variable key={2} />} />
        </Route>
        <Route path="download" element={<Download />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </>,
)

const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
})

export { router, routes }
