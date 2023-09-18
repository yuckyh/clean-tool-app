import type { AppDispatch, RootState } from '@/store'
import type { CodebookMatch } from '@/workers/column'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'
import type Fuse from 'fuse.js'
import type { Ref } from 'react'
import type { TypedUseSelectorHook } from 'react-redux'

import { getMatches, setOriginalColumns } from '@/store/columnsSlice'
import { getFile } from '@/store/fileSlice'
import { getWorkbook } from '@/store/sheetSlice'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHref, useLocation } from 'react-router-dom'

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()
  const slugToTitle = useCallback((str: string) => {
    const result = str
      .match(/[^/]*$/)?.[0]
      .split('-')
      .map((word) =>
        word.length <= 3
          ? word.toUpperCase()
          : word.replace(/^\w/, (c) => c.toUpperCase()),
      )
      .join(' ')
    return result?.length ? result : 'Home'
  }, [])
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
  ref ??= { current: null }
  const initialState = instantiator(props, ref)
  return styler(initialState)
}

export const useFetchFile = () => {
  const { fileName } = useAppSelector(({ file }) => file)
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    await dispatch(getFile(fileName))
  }, [dispatch, fileName])
}

export const useFetchWorkbook = () => {
  const { file } = useAppSelector(({ file }) => file)
  const dispatch = useAppDispatch()
  const fetchFile = useFetchFile()

  return useCallback(async () => {
    if (!file) {
      await fetchFile()
      return
    }

    await dispatch(getWorkbook({ file }))
  }, [dispatch, fetchFile, file])
}

const useFetchMatches = () => {
  const dispatch = useAppDispatch()
  const { sheet } = useAppSelector(({ sheet }) => sheet)
  const { originalColumns } = useAppSelector(({ columns: column }) => column)
  const fetchWorkbook = useFetchWorkbook()

  return useCallback(async () => {
    if (!sheet) {
      await fetchWorkbook()
      return
    }

    if (!originalColumns.length) {
      dispatch(setOriginalColumns(sheet))
      return
    }

    await dispatch(getMatches(originalColumns))
  }, [dispatch, fetchWorkbook, originalColumns, sheet])
}

export interface ColumnNameData {
  matches: Fuse.FuseResult<Pick<Required<CodebookMatch>, 'name'>>[]
  original: string
  readonly position: number
}

export const useColumnNameMatches: () => [boolean, ColumnNameData[]] = () => {
  const [columnNames, setColumnNames] = useState<ColumnNameData[]>([])
  const [isPending, startTransition] = useTransition()
  const fetchMatches = useFetchMatches()

  const { matches, originalColumns } = useAppSelector(({ columns }) => columns)

  useEffect(() => {
    startTransition(() => {
      setColumnNames(
        matches.map((column, i) => ({
          matches: column.map(({ item, ...match }) => ({
            ...match,
            item: {
              name: item.name ?? '',
            },
          })),
          original: originalColumns[i] ?? '',
          position: i,
        })),
      )
    })
  }, [matches, originalColumns])

  useEffect(() => {
    void fetchMatches()
  }, [fetchMatches])

  return [isPending, columnNames]
}

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
