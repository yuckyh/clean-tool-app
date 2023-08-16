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

type NavProps = TabListProps & {
  navRoutes: RouteObject[]
}

const Nav = ({ navRoutes, ...props }: NavProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentRoute = matchRoutes(routes, location)!.pop()!.route!
  const title = getRouteName(currentRoute!)

  const handleTabSelect: SelectTabEventHandler = (_event, data) => {
    navigate(data.value ?? '')
    return data.value ?? ''
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <TabList
        selectedValue={location.pathname}
        onTabSelect={handleTabSelect}
        {...props}>
        {navRoutes.map((route) => (
          <Tab
            key={route.id}
            value={resolvePath(route.path!, location.pathname).pathname}>
            {getRouteName(route)}
          </Tab>
        ))}
      </TabList>
    </>
  )
}

export default Nav
