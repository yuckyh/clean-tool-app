import {
  SelectTabEventHandler,
  Tab,
  TabList,
  TabListProps,
} from '@fluentui/react-components'
import {
  RouteObject,
  useResolvedPath,
  useNavigate,
  useLocation,
  resolvePath,
} from 'react-router-dom'

import { useChildRoutes, useComponentRoute, useRouteName } from '@/hooks'
import { NavHandle } from '@/router/handlers'
import { useCallback } from 'react'

const Nav = (props: TabListProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleId = 'navHandle'
  const componentRoute = useComponentRoute<NavHandle>(handleId)

  const childRoutes = useChildRoutes(
    componentRoute,
    resolvePath(componentRoute.path!).pathname,
  )

  const handleTabSelect: SelectTabEventHandler = useCallback(
    (_event, data) => {
      navigate(data.value ?? '')
      return data.value ?? ''
    },
    [navigate],
  )

  return (
    <>
      <TabList
        selectedValue={pathname}
        onTabSelect={handleTabSelect}
        {...props}>
        {childRoutes.map((childRoute) => {
          return <NavTab key={childRoute.id} route={childRoute} />
        })}
      </TabList>
    </>
  )
}

interface NavTabProps {
  route: RouteObject
}

export const NavTab = ({ route }: NavTabProps) => {
  const { pathname } = useResolvedPath(route.path!)
  const routeName = useRouteName(route)

  return <Tab value={pathname}>{routeName}</Tab>
}

export default Nav
