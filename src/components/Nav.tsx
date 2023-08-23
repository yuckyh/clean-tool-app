import type {
  SelectTabEventHandler,
  TabListProps,
} from '@fluentui/react-components'
import { Tab, TabList } from '@fluentui/react-components'
import {
  useResolvedPath,
  useNavigate,
  useLocation,
  matchRoutes,
} from 'react-router-dom'

import { useChildPaths, usePathTitle } from '@/hooks'
import { useCallback } from 'react'
import { routes } from '@/router'

const Nav = (props: TabListProps) => {
  const navigate = useNavigate()
  const componentPath = useResolvedPath('')
  const { pathname } = useLocation()

  const childPaths = useChildPaths(
    componentPath.pathname,
    componentPath.pathname,
  )

  console.log(
    matchRoutes(routes, componentPath.pathname)
      ?.filter(({ route }) => route.children)
      .map(({ route }) => route.children),
  )

  const handleTabSelect: SelectTabEventHandler = useCallback(
    (_event, { value }) => {
      navigate(value ?? '')
      return value ?? ''
    },
    [navigate],
  )

  return (
    <TabList selectedValue={pathname} onTabSelect={handleTabSelect} {...props}>
      {childPaths?.map((path) => <NavTab key={path} path={path} />)}
    </TabList>
  )
}

interface NavTabProps {
  path: string
}

export const NavTab = ({ path }: NavTabProps) => {
  const { pathname } = useResolvedPath(path)
  const label = usePathTitle(pathname)

  return <Tab value={pathname}>{label}</Tab>
}

export default Nav
