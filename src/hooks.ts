import type { Ref } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  matchRoutes,
  resolvePath,
  useHref,
  useLocation,
} from 'react-router-dom'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'
import type { WorkBook } from 'xlsx'
import Fuse from 'fuse.js'

import { routes } from '@/Router'
import { getPathTitle } from '@/helpers'
import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileStorage } from '@/lib/FileStorage'
import { sheetNameStorage } from '@/lib/SheetNameStorage'

export const useChildPaths = (parentPath: string, exclusion?: string) =>
  matchRoutes(routes, parentPath)
    ?.filter(({ route }) => route.children)
    .map(({ route }) => route.children)
    .pop()
    ?.filter(
      ({ path }) => resolvePath(path ?? parentPath).pathname !== exclusion,
    )
    .map(({ path }) => resolvePath(path ?? '').pathname)

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()
  return getPathTitle(useHref(path ?? pathname))
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

export const useOPFS = () => {
  useEffect(() => {
    void (async () =>
      (await navigator.storage.persisted()) &&
      (await navigator.storage.persist()))()
  }, [])
}

export const useThemePreference = () => {
  const themeMedia = matchMedia('(prefers-color-scheme: dark)')
  const [preference, setPreference] = useState(themeMedia.matches)

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setPreference(e.matches)
    }

    themeMedia.addEventListener('change', handleThemeChange)

    return () => {
      themeMedia.removeEventListener('change', handleThemeChange)
    }
  }, [themeMedia])
  return preference
}

export const useBodyClasses = (classes: string) => {
  useEffect(() => {
    const classList = classes.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  }, [classes])

  return classes
}

export const useFileWorker = () => {
  const fileWorker = useMemo(() => {
    const worker = new FileWorker()

    // Init request
    const request: FileRequest = {
      method: 'get',
      fileName: fileStorage.state,
    }

    worker.postMessage(request)

    return worker
  }, [])

  useEffect(() => {
    const handleWorkerResponse = ({ data }: MessageEvent<FileResponse>) => {
      const { action, fileName, file } = data
      fileStorage.state = action === 'delete' ? '' : fileName
      fileStorage.file =
        action === 'delete'
          ? new File([], '')
          : file?.size
          ? file
          : fileStorage.file
    }

    fileWorker.addEventListener('message', handleWorkerResponse)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerResponse)
    }
  }, [fileWorker])

  return fileWorker
}

export const useWorkbook = () => {
  const worker = useMemo(() => new WorkbookWorker(), [])
  const [workbook, setWorkbook] = useState<WorkBook | undefined>()
  const { file } = fileStorage

  useEffect(() => {
    const handleGetWorkbook = ({ data }: MessageEvent<WorkbookRequest>) => {
      setWorkbook(data.workbook)
    }

    // Get request
    const request: WorkbookRequest = {
      method: 'get',
      file,
    }

    worker.postMessage(request)

    worker.addEventListener('message', handleGetWorkbook)
    return () => {
      worker.removeEventListener('message', handleGetWorkbook)
    }
  }, [file, worker])

  return workbook
}

export const useSheet = () => {
  const workbook = useWorkbook()
  const sheetName = sheetNameStorage.state
  return workbook?.Sheets[sheetName]
}

export const useFuseSearch = <T>(
  list: readonly T[],
  options?: Fuse.IFuseOptions<T>,
): Fuse<T>['search'] => {
  const fuse = new Fuse(list, options)

  return (...args) => fuse.search(...args)
}
