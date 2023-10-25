import type { Progress } from '@/features/progress/reducers'
import type { TabListProps } from '@fluentui/react-components'

import { setProgress } from '@/features/progress/reducers'
import { getColumnsLength } from '@/features/sheet/selectors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Button,
  TabList,
  makeStyles,
  shorthands,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import NavTab from './Tab'

type Props = TabListProps

const useClasses = makeStyles({
  actions: {
    textAlign: 'center',
    ...shorthands.padding('32px'),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    justifyContent: 'space-between',
    left: 0,
    position: 'fixed',
    top: '110px',
  },
  tabList: {
    maxHeight: 'calc(95% - 64px)',
    overflowY: 'auto',
    ...shorthands.padding(0, '32px'),
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
        <Button appearance="primary" onClick={handleDownloadSubmit}>
          Done
        </Button>
      </div>
    </div>
  )
}
