import type { TabListProps } from '@fluentui/react-components'

import { usePathTitle } from '@/lib/string'
import { Tab, TabList } from '@fluentui/react-components'
import { useLinkClickHandler, useLocation } from 'react-router-dom'

interface Props extends TabListProps {
  paths: string[]
}

const Nav = ({ paths, ...props }: Props) => {
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
    <a onClick={handleLinkClick}>
      <Tab value={path}>{label}</Tab>
    </a>
  )
}

export default Nav
