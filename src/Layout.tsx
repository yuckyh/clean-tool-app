import { Tab, TabList } from '@fluentui/react-components'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { router } from '@/router'
import { useEffect, useState } from 'react'

const Layout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [routes, setRoutes] = useState<string[]>([])

  useEffect(() => {
    const rootRoute = router.routes[0]!
    const navRoutes = rootRoute.children!
    setRoutes(
      navRoutes
        .filter((route) => route.path !== '/' && route.path !== '*')
        .map((route) => route.path!.split('/').join('')),
    )
  }, [])

  return (
    <>
      <header>
        <TabList
          className="w-full"
          selectedValue={pathname}
          onTabSelect={(_event, data) => {
            if (!data?.value) return null
            navigate(data!.value)
            return data!.value
          }}>
          {routes.map((route) => (
            <Tab
              key={route}
              value={`/${route}`}
              style={{ textTransform: 'capitalize' }}>
              {route}
            </Tab>
          ))}
        </TabList>
      </header>
      <main className="container-lg mx-auto">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
