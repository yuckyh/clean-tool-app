import type { TabListProps } from '@fluentui/react-components'

import { TabList } from '@fluentui/react-components'
import { useLocation } from 'react-router-dom'
import { getColumnsLength } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

import { makeBy } from 'fp-ts/ReadonlyArray'
import NavTab from './Tab'

type Props = TabListProps

export default function Nav({ vertical }: Props) {
  const { pathname } = useLocation()

  const columnsLength = useAppSelector(getColumnsLength)

  return (
    <TabList selectedValue={pathname} vertical={vertical}>
      {makeBy(columnsLength, (pos) => (
        <NavTab key={pos} pos={pos} />
      ))}
    </TabList>
  )
}
