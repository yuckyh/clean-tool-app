import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import App from '@/App'
import Layout from '@/Layout'
import NotFound from '@/404'

import Home from '@/pages'
import Upload from '@/pages/Upload'
import EDA from '@/pages/EDA/Layout'
import EDAHome from '@/pages/EDA'
import Variable from '@/pages/EDA/Variable'
import Download from '@/pages/Download'
import ColumnMatching from '@/pages/ColumnMatching'

const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="upload" element={<Upload />} />
      <Route path="column-matching" element={<ColumnMatching />}></Route>
      <Route path="eda" element={<EDA />}>
        <Route index element={<EDAHome />}></Route>
        <Route path=":variable" element={<Variable />} />
      </Route>
      <Route path="download" element={<Download />} />
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
