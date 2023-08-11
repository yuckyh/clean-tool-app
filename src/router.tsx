import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import Layout from './Layout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Explorer from '@/pages/Explorer'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explorer />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
  {
    future: {
      v7_normalizeFormMethod: true,
    },
  },
)
