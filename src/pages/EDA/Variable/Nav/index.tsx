import type { TabListProps } from '@fluentui/react-components'

import { makeStyles, shorthands, TabList } from '@fluentui/react-components'
import { useLocation } from 'react-router-dom'
import { getColumnsLength } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

import * as RA from 'fp-ts/ReadonlyArray'
import NavTab from './Tab'

type Props = TabListProps

const useClasses = makeStyles({
  root: {
    position: 'fixed',
    top: '110px',
    left: 0,
    ...shorthands.padding(0, '32px'),
  },
})

export default function Nav(props: Props) {
  const classes = useClasses()

  const { pathname } = useLocation()

  const columnsLength = useAppSelector(getColumnsLength)

  return (
    <TabList {...props} selectedValue={pathname} className={classes.root}>
      {RA.makeBy(columnsLength, (pos) => (
        <NavTab key={pos} pos={pos} />
      ))}
    </TabList>
  )
}
