import type { TabListProps } from '@fluentui/react-components'

import { Link, useLocation } from 'react-router-dom'
import { getColumnsPath } from '@/features/columns/selectors'
import { TabList, Tab } from '@fluentui/react-components'
import { getColumns } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'
import { range } from '@/lib/array'

type Props = TabListProps

const Nav = ({ ...props }: Props) => {
  const { pathname } = useLocation()

  const columnsLength = useAppSelector(
    (state) => getColumns(state, false).length,
  )

  return (
    <TabList selectedValue={pathname} {...props}>
      {range(columnsLength).map((pos) => (
        <NavTab key={pos} pos={pos} />
      ))}
    </TabList>
  )
}

interface NavTabProps {
  pos: number
}

export const NavTab = ({ pos }: NavTabProps) => {
  const path = useAppSelector((state) => getColumnsPath(state, pos))

  const label = path.split('/').slice(2).join('_').replace(/-/g, '_')

  return (
    <Link to={path} style={{ all: 'unset' }}>
      <Tab value={path}>{label}</Tab>
    </Link>
  )
}

export default Nav
