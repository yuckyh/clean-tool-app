import type { ColumnRequest, ColumnResponse } from '@/workers/column'
import type { SheetRequest, SheetResponse } from '@/workers/sheet'

import ColumnWorker from '@/workers/column?worker'
import SheetWorker from '@/workers/sheet?worker'

export const sheetWorker: RequestWorker<SheetRequest, SheetResponse> =
  new SheetWorker()

export const columnWorker: RequestWorker<ColumnRequest, ColumnResponse> =
  new ColumnWorker()
