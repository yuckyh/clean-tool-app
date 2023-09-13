import type { Ref } from 'react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { useHref, useLocation } from 'react-router-dom'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'

import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileStateStore } from '@/lib/StateStore/file'
import { sheetStateStore } from '@/lib/StateStore/sheet'
import Fuse from 'fuse.js'

import codebook from '@/../data/codebook.json'
import { utils } from 'xlsx'
import { originalColumnStateStore } from './lib/StateStore/column'

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

const fileWorker = new FileWorker()

export const useFileWorker = () => {
  const fileName = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.state,
  )

  const file = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.file,
  )

  useEffect(() => {
    // Init request
    const request: FileRequest = {
      method: 'get',
      fileName,
    }

    fileWorker.postMessage(request)
  }, [fileName])

  useEffect(() => {
    const handleWorkerResponse = ({ data }: MessageEvent<FileResponse>) => {
      const { action, fileName } = data
      fileStateStore.state = action === 'delete' ? '' : fileName
      fileStateStore.file =
        action === 'delete'
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

  return fileWorker
}

const workbookWorker = new WorkbookWorker()

export const useWorkbookWorker = () => {
  useFileWorker()

  const file = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.file,
  )

  useEffect(() => {
    const request: WorkbookRequest = {
      method: 'get',
      file,
    }

    workbookWorker.postMessage(request)
  }, [file])

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
          utils.sheet_to_json(sheet)[0] ?? {},
        ).join(',')
      })
    }

    workbookWorker.addEventListener('message', handleGetWorkbook)

    return () => {
      workbookWorker.removeEventListener('message', handleGetWorkbook)
    }
  }, [])

  return workbookWorker
}

const useFuseSearch: <T>(
  list: readonly T[],
  options?: Fuse.IFuseOptions<T>,
) => Fuse<T>['search'] = (list, options) => {
  return useCallback(
    (...args) => {
      const fuse = new Fuse(list, options)
      return fuse.search(...args)
    },
    [list, options],
  )
}

type CodebookEntry = (typeof codebook)[0]
export type CodebookEntryKey = keyof CodebookEntry
export type CodebookMatch = Partial<CodebookEntry>

export interface ColumnNameData {
  original: string
  matches: Fuse.FuseResult<CodebookMatch>[]
  readonly position: number
}

export const useColumnNameMatches: () => ColumnNameData[] = () => {
  const [columnNames, setColumnNames] = useState<ColumnNameData[]>([])
  const searchOpts: Fuse.IFuseOptions<CodebookMatch> = useMemo(
    () => ({
      keys: ['name'],
      threshold: 1,
      includeScore: true,
    }),
    [],
  )
  const search = useFuseSearch<CodebookMatch>(codebook, searchOpts)

  const originalColumns = useSyncExternalStore(
    originalColumnStateStore.subscribe,
    () => originalColumnStateStore.state,
  )

  useEffect(() => {
    setColumnNames(
      originalColumns.split(',').map((original, i) => ({
        original,
        matches: search(original).map(({ item, ...match }) => ({
          ...match,
          item: {
            name: item.name,
          },
        })),
        position: i,
      })),
    )
  }, [originalColumns, search])

  return columnNames
}
