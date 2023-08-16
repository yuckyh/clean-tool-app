import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import Layout from '@/Layout'
import Home from '@/pages/Home'
import NotFound from '@/pages/404'
import EDA from '@/pages/EDA'
import Variable from '@/pages/EDA/Variable'
import Upload from '@/pages/Upload'

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="upload" element={<Upload />} />
    <Route path="eda" element={<EDA />}>
      <Route path="variable1" element={<Variable key={1} />} />
      <Route path="variable2" element={<Variable key={2} />} />
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
