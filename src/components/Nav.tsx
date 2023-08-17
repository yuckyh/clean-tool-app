import {
  SelectTabEventHandler,
  Tab,
  TabList,
  TabListProps,
} from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import {
  matchRoutes,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { getRouteName } from '@/helpers'
import { routes } from '@/router'
import { useChildRoutesHandler } from '@/router/hooks'

const Nav = (props: TabListProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [childRoutes, handlerMatch] = useChildRoutesHandler()
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
        {childRoutes.map((childRoute) => {
          const resolvedPath = resolvePath(
            childRoute.path!,
            handlerMatch.pathname,
          ).pathname
          return (
            <Tab key={childRoute.id} value={resolvedPath}>
              {getRouteName(childRoute)}
            </Tab>
          )
        })}
      </TabList>
    </>
  )
}

export default Nav
