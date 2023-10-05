import type { ColumnResponse, ColumnRequest } from '@/workers/column'
import type { SheetResponse, SheetRequest } from '@/workers/sheet'

import ColumnWorker from '@/workers/column?worker'
import SheetWorker from '@/workers/sheet?worker'

export const sheetWorker: RequestWorker<SheetRequest, SheetResponse> =
  new SheetWorker()

export const columnWorker: RequestWorker<ColumnRequest, ColumnResponse> =
  new ColumnWorker()
