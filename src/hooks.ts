import type { Ref } from 'react'
import { useEffect, useState } from 'react'
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
import Fuse from 'fuse.js'

import { routes } from '@/Router'
import { getPathTitle } from '@/helpers'
import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileStateStorage } from '@/lib/StateStorage/file'
import { sheetStateStorage } from '@/lib/StateStorage/sheet'

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

const fileWorker = new FileWorker()

export const useFileWorker = () => {
  const handleWorkerResponse = ({ data }: MessageEvent<FileResponse>) => {
    const { action, fileName, file } = data
    fileStateStorage.state = action === 'delete' ? '' : fileName
    fileStateStorage.file =
      action === 'delete'
        ? new File([], '')
        : file?.size
        ? file
        : fileStateStorage.file
  }

  useEffect(() => {
    // Init request
    const request: FileRequest = {
      method: 'get',
      fileName: fileStateStorage.state,
    }

    fileWorker.postMessage(request)

    fileWorker.addEventListener('message', handleWorkerResponse)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerResponse)
    }
  }, [])

  return fileWorker
}

export const useFile = () => {
  const [file, setFile] = useState(fileStateStorage.file)

  useEffect(() => {
    const listener = () => {
      setFile(fileStateStorage.file)
    }

    fileWorker.addEventListener('message', listener)

    return () => {
      fileWorker.removeEventListener('message', listener)
    }
  }, [])
  return file
}

const workbookWorker = new WorkbookWorker()

export const useWorkbookWorker = () => {
  useFileWorker()

  const handleGetWorkbook = ({ data }: MessageEvent<WorkbookRequest>) => {
    sheetStateStorage.workbook = data.workbook
    sheetStateStorage.state =
      data.workbook?.SheetNames[0] ?? sheetStateStorage.state
  }

  const file = useFile()

  useEffect(() => {
    const request: WorkbookRequest = {
      method: 'get',
      file,
    }

    workbookWorker.postMessage(request)
  }, [file])

  useEffect(() => {
    workbookWorker.addEventListener('message', handleGetWorkbook)

    return () => {
      workbookWorker.removeEventListener('message', handleGetWorkbook)
    }
  }, [])

  return workbookWorker
}

export const useSheet = () => {
  const [sheet, setSheet] = useState(sheetStateStorage.sheet)

  useEffect(() => {
    const listener = sheetStateStorage.addEventListener((storage) => {
      setSheet(storage.sheet)
    })

    return () => {
      sheetStateStorage.removeEventListener(listener)
    }
  }, [])
  return sheet
}

export const useFuseSearch = <T>(
  list: readonly T[],
  options?: Fuse.IFuseOptions<T>,
): Fuse<T>['search'] => {
  const fuse = new Fuse(list, options)

  return (...args) => fuse.search(...args)
}
