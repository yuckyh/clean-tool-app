/* eslint-disable
  functional/functional-parameters
*/
import type { Progress } from '@/features/progress/reducers'

import { getVisits } from '@/app/selectors'
import {
  getColumnPath,
  getColumnPaths,
  getIndices,
} from '@/features/columns/selectors'
import { setProgress } from '@/features/progress/reducers'
import { getLocationPathWords } from '@/features/progress/selectors'
import { getFirstVisit } from '@/features/sheet/selectors'
import { arrLookup } from '@/lib/array'
import { length } from '@/lib/fp'
import { kebabToSnake } from '@/lib/fp/string'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getColumnsLength } from '@/selectors/selectors'
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

const useClasses = makeStyles({
  actionPositive: {
    ':hover': {
      backgroundColor: tokens.colorPaletteGreenBackground3,
      color: tokens.colorNeutralStrokeOnBrand2Hover,
    },
    ':hover:active': {
      backgroundColor: tokens.colorPaletteGreenForeground1,
      color: tokens.colorNeutralStrokeOnBrand2Pressed,
    },
    backgroundColor: tokens.colorPaletteGreenForegroundInverted,
    color: tokens.colorNeutralStrokeOnBrand,
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

/**
 *
 */
export default function Nav() {
  const classes = useClasses()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const dispatch = useAppDispatch()

  const columnsLength = useAppSelector(getColumnsLength)
  const indices = useAppSelector(getIndices)
  const visits = useAppSelector(getVisits)
  const firstVisit = useAppSelector(getFirstVisit)
  const columnPaths = useAppSelector(getColumnPaths)
  const pathWords = useAppSelector((state) =>
    getLocationPathWords(state, '', pathname),
  )
  const depth = useMemo(() => length(pathWords), [pathWords])

  const column = useMemo(
    () => f.pipe(pathWords, f.flip(arrLookup)(''), f.apply(1), kebabToSnake),
    [pathWords],
  )
  const visit = useMemo(() => arrLookup(pathWords)('')(2), [pathWords])

  const pos = useMemo(
    () =>
      f.pipe(
        indices,
        RA.findIndex(([matchColumn, matchVisit]) =>
          Eq.tuple(S.Eq, S.Eq).equals(
            [column, visit || firstVisit],
            [matchColumn, arrLookup(visits)('')(matchVisit)],
          ),
        ),
        f.pipe(-1, f.constant, O.getOrElse),
      ),
    [column, firstVisit, indices, visit, visits],
  )

  const prevColumnPath = useAppSelector((state) =>
    getColumnPath(state, pos - 1),
  )
  const nextColumnPath = useAppSelector((state) =>
    getColumnPath(state, pos + 1),
  )

  const handlePrevVariable = useCallback(() => {
    if (depth === 2) {
      navigate(arrLookup(columnPaths)('')(0))
      return undefined
    }

    if (
      !f.pipe(prevColumnPath, S.split('/'), f.flip(arrLookup)(''), f.apply(2))
    ) {
      return undefined
    }

    navigate(prevColumnPath)
    return undefined
  }, [columnPaths, depth, navigate, prevColumnPath])

  const handleNextVariable = useCallback(() => {
    if (depth === 2) {
      navigate(arrLookup(columnPaths)('')(0))
      return undefined
    }

    if (
      !f.pipe(nextColumnPath, S.split('/'), f.flip(arrLookup)(''), f.apply(2))
    ) {
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
      <TabList className={classes.tabList} selectedValue={pathname} vertical>
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
