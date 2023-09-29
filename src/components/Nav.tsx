import type {
  SelectTabEventHandler,
  TabListProps,
} from '@fluentui/react-components'

import { usePathTitle } from '@/lib/string'
import { Tab, TabList } from '@fluentui/react-components'
import { useLinkClickHandler, useLocation, useNavigate } from 'react-router-dom'

interface Props extends TabListProps {
  paths: string[]
}

const Nav = ({ paths, ...props }: Props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <TabList selectedValue={pathname} {...props}>
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
  const label = usePathTitle(path)
  const handleLinkClick = useLinkClickHandler(path)

  return (
    <Tab onClick={handleLinkClick} value={path}>
      {label}
    </Tab>
  )
}

export default Nav
