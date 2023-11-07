/* eslint-disable
  functional/prefer-immutable-types,
  import/default
*/
import type { ColumnRequest, ColumnResponse } from '@/workers/column'
import type { SheetRequest, SheetResponse } from '@/workers/sheet'

import ColumnWorker from '@/workers/column?worker'
import SheetWorker from '@/workers/sheet?worker'

export const sheetWorker: Readonly<RequestWorker<SheetRequest, SheetResponse>> =
  new SheetWorker()

export const columnWorker: Readonly<
  RequestWorker<ColumnRequest, ColumnResponse>
> = new ColumnWorker()
