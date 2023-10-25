import type { Progress } from '@/features/progress/reducers'
import type { TabListProps } from '@fluentui/react-components'

import { getVisits } from '@/app/selectors'
import {
  getColumnPath,
  getColumnPaths,
  getIndices,
} from '@/features/columns/selectors'
import { setProgress } from '@/features/progress/reducers'
import { getColumnsLength } from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Button,
  TabList,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import NavTab from './Tab'

type Props = TabListProps

const useClasses = makeStyles({
  actionPositive: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    ...shorthands.padding('32px'),
  },
  columns: {
    columnGap: tokens.spacingHorizontalS,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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
  const indices = useAppSelector(getIndices)
  const visits = useAppSelector(getVisits)
  const columnPaths = useAppSelector(getColumnPaths)

  const pathWords = useMemo(() => S.split('/')(pathname), [pathname])
  const depth = useMemo(() => pathWords.length, [pathWords.length])
  const column = useMemo(() => stringLookup(pathWords)(2), [pathWords])
  const visit = useMemo(() => stringLookup(pathWords)(3), [pathWords])

  const pos = useMemo(
    () =>
      f.pipe(
        indices,
        RA.findIndex(([matchColumn, matchVisit]) =>
          Eq.tuple(S.Eq, S.Eq).equals(
            [S.replace(/-/g, '_')(column), visit || stringLookup(visits)(0)],
            [matchColumn, stringLookup(visits)(matchVisit)],
          ),
        ),
        f.pipe(-1, f.constant, O.getOrElse),
      ),
    [column, indices, visit, visits],
  )

  const prevColumnPath = useAppSelector((state) =>
    getColumnPath(state, pos - 1),
  )
  const nextColumnPath = useAppSelector((state) =>
    getColumnPath(state, pos + 1),
  )

  const handlePrevVariable = useCallback(() => {
    if (depth === 2) {
      navigate(stringLookup(columnPaths)(0))
      return undefined
    }

    if (!f.pipe(prevColumnPath, S.split('/'), f.flip(stringLookup)(2))) {
      return undefined
    }

    navigate(prevColumnPath)
    return undefined
  }, [columnPaths, depth, navigate, prevColumnPath])

  const handleNextVariable = useCallback(() => {
    if (depth === 2) {
      navigate(stringLookup(columnPaths)(0))
      return undefined
    }

    if (!f.pipe(nextColumnPath, S.split('/'), f.flip(stringLookup)(2))) {
      return undefined
    }

    navigate(nextColumnPath)
    return undefined
  }, [columnPaths, depth, navigate, nextColumnPath])

  const handleDone = useCallback(() => {
    f.pipe(
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
        {RA.makeBy(columnsLength, (col) => (
          <NavTab key={col} pos={col} />
        ))}
      </TabList>
      <div className={classes.actions}>
        <div className={classes.columns}>
          <Button appearance="primary" onClick={handlePrevVariable}>
            Previous
          </Button>
          <Button appearance="primary" onClick={handleNextVariable}>
            Next
          </Button>
        </div>
        <div className={classes.columns}>
          <Button
            appearance="primary"
            className={classes.actionPositive}
            onClick={handleDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
