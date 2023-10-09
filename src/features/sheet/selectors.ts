import type { RootState } from '@/app/store'

import { createSelector } from '@reduxjs/toolkit'
import { just } from '@/lib/utils'
import { utils } from 'xlsx'

const getFileName = ({ sheet }: RootState) => sheet.fileName
export const getSheet = ({ sheet }: RootState, isOriginal = true) =>
  sheet[isOriginal ? 'original' : 'edited'].sheets[sheet.sheetName]

export const getData = createSelector([getSheet], (sheet) =>
  utils.sheet_to_json<CellItem>(sheet ?? {}),
)

export const getColumn = (state: RootState, isOriginal: boolean, pos: number) =>
  getColumns(state, isOriginal)[pos] ?? ''

export const getColumns = createSelector([getData], (data) =>
  just(data[0] ?? {})(Object.keys)(),
)

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) =>
    (...args: [number, number]) => {
      const [a, b] = args.map((pos) => columns[pos] ?? '') as [string, string]

      return a.localeCompare(b)
    },
)

export const getFormattedFileName = createSelector(
  [getFileName],
  (fileName) => {
    const fileNameArray = fileName.split('.')
    const ext = fileNameArray.pop()
    return `${fileNameArray.join('.')}.formatted.${ext}`
  },
)
