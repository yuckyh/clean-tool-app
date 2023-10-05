import type { TabListProps } from '@fluentui/react-components'

import { useLinkClickHandler, useLocation } from 'react-router-dom'
import { TabList, Tab } from '@fluentui/react-components'
import { usePathTitle } from '@/lib/string'

interface Props extends TabListProps {
  paths: string[]
}

const Nav = ({ paths, ...props }: Props) => {
  const { pathname } = useLocation()

  return (
    <TabList selectedValue={pathname} {...props}>
      {paths.map((path) => (
        <NavTab path={path} key={path} />
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
