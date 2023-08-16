import {
  SelectTabEventHandler,
  Tab,
  TabList,
  TabListProps,
} from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import {
  RouteObject,
  matchRoutes,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { getRouteName } from '@/helpers'
import { routes } from '@/router'
import { useState } from 'react'

type NavProps = TabListProps & {
  navRoutes: RouteObject[]
}

const Nav = ({ navRoutes, ...props }: NavProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentRoute = matchRoutes(routes, location)!.pop()!.route!
  const title = getRouteName(currentRoute!)
  const [resolvedPaths] = useState(
    navRoutes.map(
      (route) => resolvePath(route.path!, location.pathname).pathname,
    ),
  )

  const handleTabSelect: SelectTabEventHandler = (_event, data) => {
    navigate(data.value ?? '')
    return data.value ?? ''
  }

  console.log(resolvePath)

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <TabList
        selectedValue={location.pathname}
        onTabSelect={handleTabSelect}
        {...props}>
        {navRoutes.map((route, i) => {
          return (
            <Tab key={route.id} value={resolvedPaths[i]}>
              {getRouteName(route)}
            </Tab>
          )
        })}
      </TabList>
    </>
  )
}

export default Nav
