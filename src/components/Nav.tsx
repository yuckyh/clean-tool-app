import type {
  SelectTabEventHandler,
  TabListProps,
} from '@fluentui/react-components'
import { Tab, TabList } from '@fluentui/react-components'
import { useNavigate, useLocation, useHref } from 'react-router-dom'

import { usePathTitle } from '@/hooks'
import { useCallback } from 'react'

interface NavProps extends TabListProps {
  paths: string[]
}

const Nav = ({ paths, ...props }: NavProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleTabSelect: SelectTabEventHandler = useCallback(
    (_event, { value }) => {
      navigate(value ?? '')
      return value ?? ''
    },
    [navigate],
  )

  return (
    <TabList selectedValue={pathname} onTabSelect={handleTabSelect} {...props}>
      {paths.map((path) => (
        <NavTab key={path} path={path} />
      ))}
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
