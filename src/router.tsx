import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import Layout from './Layout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import EDA from '@/pages/EDA'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/eda" element={<EDA />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
  {
    future: {
      v7_normalizeFormMethod: true,
    }
  }
)
