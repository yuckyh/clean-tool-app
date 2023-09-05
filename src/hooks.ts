import type { Ref } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

import { routes } from '@/Router'
import { getPathTitle } from '@/helpers'
import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileNameStorage } from '@/lib/FileNameStorage'
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
      method: 'index',
      fileName: fileNameStorage.state,
    }

    worker.postMessage(request)

    return worker
  }, [])

  const handleWorkerResponse = useCallback(
    ({ data }: MessageEvent<FileResponse>) => {
      const { action, fileName } = data
      fileNameStorage.state = action === 'delete' ? '' : fileName
    },
    [],
  )

  useEffect(() => {
    fileWorker.addEventListener('message', handleWorkerResponse)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerResponse)
    }
  }, [fileWorker, handleWorkerResponse])

  return fileWorker
}

export const useFileName = () => {
  const [fileName, setFileName] = useState(fileNameStorage.state)

  useEffect(() => {
    const listener = fileNameStorage.addStateListener((state) => {
      setFileName(state)
    })

    return () => {
      fileNameStorage.removeStateListener(listener)
    }
  }, [])

  return fileName
}

export const useFile = () => {
  const fileWorker = useFileWorker()
  const fileName = useFileName()
  const [file, setFile] = useState<File>(new File([], ''))

  useEffect(() => {
    const handleGetFile = ({ data }: MessageEvent<FileResponse>) => {
      setFile(data.file ?? new File([], ''))
    }

    fileWorker.addEventListener('message', handleGetFile)

    const request: FileRequest = {
      method: 'get',
      fileName,
    }

    fileWorker.postMessage(request)
    return () => {
      fileWorker.removeEventListener('message', handleGetFile)
    }
  }, [fileName, fileWorker])

  return file
}

export const useWorkbook = () => {
  const worker = useMemo(() => new WorkbookWorker(), [])
  const [workbook, setWorkbook] = useState<WorkBook | undefined>()
  const file = useFile()

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

export const useSheetName = () => {
  const workbook = useWorkbook()
  const [sheetName, setSheetName] = useState(sheetNameStorage.state)

  useEffect(() => {
    if (workbook) {
      const { SheetNames } = workbook
      sheetNameStorage.state = SheetNames[0] ?? ''
      setSheetName(sheetNameStorage.state)
    }

    const listener = sheetNameStorage.addStateListener((sheetName) => {
      setSheetName(sheetName)
    })

    return () => {
      sheetNameStorage.removeStateListener(listener)
    }
  }, [workbook])

  return sheetName
}

export const useSheet = () => {
  const workbook = useWorkbook()
  const sheetName = useSheetName()
  return workbook?.Sheets[sheetName]
}
