import type { Ref } from 'react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'
import { useHref, useLocation } from 'react-router-dom'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'

import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import ColumnWorker from '@/workers/column?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileStateStore } from '@/lib/StateStore/file'
import { sheetStateStore } from '@/lib/StateStore/sheet'
import {
  columnStateStore,
  originalColumnStateStore,
} from '@/lib/StateStore/column'
import type Fuse from 'fuse.js'

import codebook from '@/../data/codebook.json'
import { utils } from 'xlsx'
import type { ColumnResponse } from './workers/column'

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()
  const slugToTitle = useCallback(
    (str: string) =>
      str
        .replace(/^\//, '')
        .match(/[^/]*$/)?.[0]
        .split('-')
        .map((word) =>
          word.length <= 3
            ? word.toUpperCase()
            : word.replace(/^\w/, (c) => c.toUpperCase()),
        )
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        .join(' ') || 'Home',
    [],
  )
  return slugToTitle(useHref(path ?? pathname))
}

export const useFluentStyledState = <
  Props extends ComponentProps<Slots>,
  State extends ComponentState<Slots>,
  Slots extends SlotPropsRecord = SlotPropsRecord,
  V = HTMLElement,
>(
  props: Props,
  styler: (state: State) => State,
  instantiator: (props: Props, ref: Ref<V>) => State,
  ref?: Ref<V>,
): State => {
  ref = ref ?? { current: null }
  const initialState = instantiator(props, ref)
  return styler(initialState)
}

export const fileWorker = new FileWorker()

export const useGetFile = () => {
  const fileName = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.state,
  )

  const file = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.file,
  )

  useEffect(() => {
    if (file.size) {
      return
    }

    // Init request
    const request: FileRequest = {
      method: 'get',
      fileName,
    }

    fileWorker.postMessage(request)
  }, [file.size, fileName])

  useEffect(() => {
    const handleWorkerResponse = ({ data }: MessageEvent<FileResponse>) => {
      const { action, fileName } = data
      const isDelete = action === 'delete'
      fileStateStore.state = isDelete ? '' : fileName
      fileStateStore.file = isDelete
        ? new File([], '')
        : data.file?.size
        ? data.file
        : file
    }

    fileWorker.addEventListener('message', handleWorkerResponse)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerResponse)
    }
  }, [file])
}

export const workbookWorker = new WorkbookWorker()

export const useGetWorkbook = () => {
  useGetFile()
  const file = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.file,
  )

  const sheet = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.sheet,
  )

  useEffect(() => {
    if (sheet) {
      return
    }

    // Init request
    const request: WorkbookRequest = {
      method: 'get',
      file,
    }

    workbookWorker.postMessage(request)
  }, [file, sheet])

  useEffect(() => {
    const handleGetWorkbook = ({ data }: MessageEvent<WorkbookRequest>) => {
      sheetStateStore.workbook = data.workbook
      sheetStateStore.state = data.workbook?.SheetNames.includes(
        sheetStateStore.state,
      )
        ? sheetStateStore.state
        : data.workbook?.SheetNames[0] ?? ''

      sheetStateStore.subscribe(({ sheet }) => {
        originalColumnStateStore.state = Object.keys(
          (sheet && utils.sheet_to_json(sheet)[0]) ?? {},
        ).join(',')
      })
    }

    workbookWorker.addEventListener('message', handleGetWorkbook)

    return () => {
      workbookWorker.removeEventListener('message', handleGetWorkbook)
    }
  }, [])
}

const columnWorker = new ColumnWorker()

const useGetColumnMatches = <T>(options: Fuse.IFuseOptions<T>) => {
  useGetWorkbook()
  const sheet = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.sheet,
  )

  useEffect(() => {
    // Init request
    const request = {
      method: 'get',
      list: codebook.map(({ name }) => name),
      columns: originalColumnStateStore.state.split(','),
      options,
    }

    columnWorker.postMessage(request)
  }, [options, sheet])

  useEffect(() => {
    const handleGetColumns = ({ data }: MessageEvent<ColumnResponse>) => {
      columnStateStore.state = Array.from(columnStateStore.columns)[0]
        ? columnStateStore.state
        : data.columns.map((matches) => matches[0]?.item).join(',')
    }

    columnWorker.addEventListener('message', handleGetColumns)

    return () => {
      columnWorker.removeEventListener('message', handleGetColumns)
    }
  }, [])

  return columnWorker
}

type CodebookEntry = (typeof codebook)[0]
export type CodebookEntryKey = keyof CodebookEntry
export type CodebookMatch = Partial<CodebookEntry>

export interface ColumnNameData {
  original: string
  matches: Fuse.FuseResult<CodebookMatch>[]
  readonly position: number
}

export const useColumnNameMatches: () => [boolean, ColumnNameData[]] = () => {
  useGetWorkbook()
  const [columnNames, setColumnNames] = useState<ColumnNameData[]>([])
  const [isPending, startTransition] = useTransition()
  const searchOpts: Fuse.IFuseOptions<CodebookMatch> = useMemo(
    () => ({
      keys: ['name'],
      threshold: 1,
      includeScore: true,
    }),
    [],
  )
  useGetColumnMatches(searchOpts)

  const originalColumns = useSyncExternalStore(
    originalColumnStateStore.subscribe,
    () => originalColumnStateStore.state,
  )

  useEffect(() => {
    const handleWorkerMatch = ({ data }: MessageEvent<ColumnResponse>) => {
      const { action, columns } = data
      if (action === 'get') {
        startTransition(() => {
          setColumnNames(
            columns.map((column, i) => ({
              original: originalColumns.split(',')[i] ?? '',
              matches: column.map(({ item, ...match }) => ({
                ...match,
                item: {
                  name: item,
                },
              })),
              position: i,
            })),
          )
        })
      }
    }

    columnWorker.addEventListener('message', handleWorkerMatch)

    return () => {
      columnWorker.removeEventListener('message', handleWorkerMatch)
    }
  }, [originalColumns])

  return [isPending, columnNames]
}
