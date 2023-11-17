/**
 * @file This file contains the hooks for the EDA data grids.
 * @module pages/EDA/Variable/DataGrid/hooks
 */

/* eslint-disable
  import/prefer-default-export
*/
import type { DataGridProps } from '@fluentui/react-components'

import { getIndexedIndex } from '@/lib/array'
import { selectFlaggedRows } from '@/pages/EDA/Variable/DataGrid/selectors'
import { syncFlaggedCells } from '@/reducers/data'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useCallback, useMemo } from 'react'

import * as Flag from '../../../../lib/fp/Flag'
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks'

/**
 *
 * @param reason
 * @param title
 * @param series
 * @returns
 * @example
 */

export const useSyncedSelectionHandler = (
  reason: Flag.FlagReason,
  title: string,
  series: readonly (readonly [string, number | string])[],
) => {
  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))

  const indices = useMemo(() => RA.map(getIndexedIndex)(series), [series])

  return useCallback<Required<DataGridProps>['onSelectionChange']>(
    (_event, { selectedItems }) => {
      const shouldAdd = flaggedRows.size < selectedItems.size

      const subtractor = (
        shouldAdd ? selectedItems : flaggedRows
      ) as ReadonlySet<string>

      const subtractee = (
        shouldAdd ? flaggedRows : selectedItems
      ) as ReadonlySet<string>

      const checkedPosList = f.pipe(
        subtractor,
        RS.difference(S.Eq)(subtractee),
        RS.toReadonlyArray(S.Ord),
        RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(indices)),
      )

      const payloads = f.pipe(
        checkedPosList,
        RA.map((currentIndex) => Flag.of(currentIndex, title, reason)),
      )

      const unfilteredPayloads = f.pipe(
        checkedPosList,
        RA.map((currentIndex) => Flag.of(currentIndex, title, 'outlier')),
      )

      return f.pipe(
        [...payloads, ...unfilteredPayloads] as const,
        RA.map(f.flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
        IO.sequenceArray,
      )()
    },
    [dispatch, flaggedRows, indices, reason, title],
  )
}
