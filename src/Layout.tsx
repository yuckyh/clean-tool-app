import { Outlet } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'
import { routes } from '@/router'
import { getChildRoutes } from './helpers'
import { useState } from 'react'

const Layout = () => {
  const [navRoutes] = useState(getChildRoutes(routes[0]!))
  return (
    <>
      <header>
        <ProgressNav
          thickness="large"
          max={1}
          value={0.5}
          navRoutes={navRoutes}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
