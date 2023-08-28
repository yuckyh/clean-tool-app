import type {
  SelectTabEventHandler,
  TabListProps,
} from '@fluentui/react-components'
import { Tab, TabList } from '@fluentui/react-components'
import {
  useResolvedPath,
  useNavigate,
  useLocation,
  useHref,
} from 'react-router-dom'

import { useChildPaths, usePathTitle } from '@/hooks'
import { useCallback } from 'react'

const Nav = (props: TabListProps) => {
  const navigate = useNavigate()
  const componentPath = useResolvedPath('')
  const { pathname } = useLocation()

  const childPaths = useChildPaths(
    componentPath.pathname,
    componentPath.pathname,
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
  const href = useHref(path)
  const label = usePathTitle(path)

  return <Tab value={href}>{label}</Tab>
}

export default Nav
