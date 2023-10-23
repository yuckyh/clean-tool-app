import type { TabListProps } from '@fluentui/react-components'

import {
  makeStyles,
  shorthands,
  TabList,
  Button,
} from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { getColumnsLength } from '@/features/sheet/selectors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import * as RA from 'fp-ts/ReadonlyArray'
import { useCallback } from 'react'
import type { Progress } from '@/features/progress/reducers'
import { setProgress } from '@/features/progress/reducers'
import { pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
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

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const dispatch = useAppDispatch()

  const columnsLength = useAppSelector(getColumnsLength)

  const handleDownloadSubmit = useCallback(() => {
    pipe(
      'explored' as Progress,
      setProgress,
      (x) => dispatch(x),
      () => {
        navigate('/download')
      },
      IO.of,
    )()
  }, [dispatch, navigate])

  return (
    <div className={classes.root}>
      <TabList {...props} className={classes.tabList} selectedValue={pathname}>
        {RA.makeBy(columnsLength, (pos) => (
          <NavTab key={pos} pos={pos} />
        ))}
      </TabList>
      <div className={classes.actions}>
        <Button onClick={handleDownloadSubmit} appearance="primary">
          Done
        </Button>
      </div>
    </div>
  )
}
