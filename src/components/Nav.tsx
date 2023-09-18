import type {
  SelectTabEventHandler,
  TabListProps,
} from '@fluentui/react-components'

import { usePathTitle } from '@/hooks'
import { Tab, TabList } from '@fluentui/react-components'
import { useCallback } from 'react'
import { useHref, useLocation, useNavigate } from 'react-router-dom'

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
    <TabList onTabSelect={handleTabSelect} selectedValue={pathname} {...props}>
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
