import { getColParam, getDataTypes } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'

import { getSearchedPos } from '.'

/**
 *
 */
export const getDataType = createSelector(
  [getDataTypes, getColParam],
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)

/**
 *
 */
export const getSearchedDataType = createSelector(
  [getDataTypes, getSearchedPos],
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)
