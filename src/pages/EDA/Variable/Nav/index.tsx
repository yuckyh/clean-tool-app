import type { TabListProps } from '@fluentui/react-components'

import {
  makeStyles,
  shorthands,
  TabList,
  Button,
} from '@fluentui/react-components'
import { useLocation } from 'react-router-dom'
import { getColumnsLength } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

import * as RA from 'fp-ts/ReadonlyArray'
import NavTab from './Tab'

type Props = TabListProps

const useClasses = makeStyles({
  root: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'fixed',
    display: 'flex',
    height: '90vh',
    top: '110px',
    left: 0,
  },
  tabList: {
    maxHeight: 'calc(95% - 64px)',
    overflowY: 'auto',
    ...shorthands.padding(0, '32px'),
  },
  actions: {
    textAlign: 'center',
    ...shorthands.padding('32px'),
  },
})

export default function Nav(props: Props) {
  const classes = useClasses()

  const { pathname } = useLocation()

  const columnsLength = useAppSelector(getColumnsLength)

  return (
    <div className={classes.root}>
      <TabList {...props} className={classes.tabList} selectedValue={pathname}>
        {RA.makeBy(columnsLength, (pos) => (
          <NavTab key={pos} pos={pos} />
        ))}
      </TabList>
      <div className={classes.actions}>
        <Button appearance="primary">Download</Button>
      </div>
    </div>
  )
}
