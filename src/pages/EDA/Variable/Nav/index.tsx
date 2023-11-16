import type { AppState } from '@/app/store'
import type { Progress } from '@/reducers/progress'

import { arrayLookup, findIndex } from '@/lib/array'
import { kebabToSnake } from '@/lib/fp/string'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setProgress } from '@/reducers/progress'
import { getColumnsLength } from '@/selectors/data/columns'
import { getFirstVisit, getVisits } from '@/selectors/data/visits'
import {
  getColumnPath,
  getColumnPaths,
  getIndices,
} from '@/selectors/matches/format'
import { getLocationPathWords } from '@/selectors/progress/paths'
import {
  Button,
  TabList,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
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
 * @param pathname
 * @returns
 * @example
 */
const selectPathWords = (pathname: string) => (state: AppState) =>
  getLocationPathWords(state, '', pathname)

/**
 *
 * @param pos
 * @returns
 * @example
 */
const selectPrevVariablePath = (pos: number) => (state: AppState) =>
  getColumnPath(state, pos - 1)

/**
 *
 * @param pos
 * @returns
 * @example
 */
const selectNextVariablePath = (pos: number) => (state: AppState) =>
  getColumnPath(state, pos + 1)

/**
 * The navigation for the variable page.
 * @returns The component object
 * @example
 * ```tsx
 *  <Nav />
 * ```
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
  const pathWords = useAppSelector(selectPathWords(pathname))
  const depth = useMemo(() => RA.size(pathWords), [pathWords])

  const column = useMemo(
    () => f.pipe(pathWords, arrayLookup, f.apply(''), f.apply(1), kebabToSnake),
    [pathWords],
  )
  const visit = useMemo(() => arrayLookup(pathWords)('')(2), [pathWords])

  const pos = useMemo(
    () =>
      f.pipe(
        indices,
        RA.map(
          ([matchColumn, matchVisit]) =>
            [matchColumn, arrayLookup(visits)('')(matchVisit)] as const,
        ),
        findIndex,
        f.apply(Eq.tuple(S.Eq, S.Eq)),
        f.apply([column, visit || firstVisit] as const),
      ),
    [column, firstVisit, indices, visit, visits],
  )

  const prevColumnPath = useAppSelector(selectPrevVariablePath(pos))
  const nextColumnPath = useAppSelector(selectNextVariablePath(pos))

  const handlePrevVariable = useCallback(() => {
    if (depth === 2) {
      navigate(arrayLookup(columnPaths)('')(0))
      return
    }

    if (!f.pipe(prevColumnPath, S.split('/'), arrayLookup)('')(2)) {
      return
    }

    navigate(prevColumnPath)
  }, [columnPaths, depth, navigate, prevColumnPath])

  const handleNextVariable = useCallback(() => {
    if (depth === 2) {
      navigate(arrayLookup(columnPaths)('')(0))
      return
    }

    if (!f.pipe(nextColumnPath, S.split('/'), arrayLookup)('')(2)) {
      return
    }

    navigate(nextColumnPath)
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
