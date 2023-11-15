/* eslint-disable
  import/prefer-default-export
*/
import { getRowParam } from '@/app/selectors'
import { arrayLookup, recordLookup } from '@/lib/array'
import * as CellItem from '@/lib/fp/CellItem'
import { createSelector } from '@reduxjs/toolkit'
import * as f from 'fp-ts/function'

import { getData } from './data'
import { getOriginalColumn } from './columns'

/**
 *
 */
export const getCell = createSelector(
  [getData, getOriginalColumn, getRowParam],
  (data, originalColumn, row) =>
    f.pipe(
      arrayLookup(data)(CellItem.of({}))(row),
      CellItem.unwrap,
      recordLookup,
    )('')(originalColumn),
)
