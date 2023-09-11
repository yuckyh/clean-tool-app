import type { Ref } from 'react'
import { useEffect, useSyncExternalStore } from 'react'
import { useHref, useLocation } from 'react-router-dom'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'

import { getPathTitle } from '@/helpers'
import FileWorker from '@/workers/file?worker'
import WorkbookWorker from '@/workers/workbook?worker'
import type { WorkbookRequest } from '@/workers/workbook'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileStateStore } from '@/lib/StateStore/file'
import { sheetStateStore } from '@/lib/StateStore/sheet'

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

const fileWorker = new FileWorker()

export const useFileWorker = () => {
  const handleWorkerResponse = ({ data }: MessageEvent<FileResponse>) => {
    const { action, fileName, file } = data
    fileStateStore.state = action === 'delete' ? '' : fileName
    fileStateStore.file =
      action === 'delete'
        ? new File([], '')
        : file?.size
        ? file
        : fileStateStore.file
  }

  useEffect(() => {
    // Init request
    const request: FileRequest = {
      method: 'get',
      fileName: fileStateStore.state,
    }

    fileWorker.postMessage(request)

    fileWorker.addEventListener('message', handleWorkerResponse)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerResponse)
    }
  }, [])

  return fileWorker
}

const workbookWorker = new WorkbookWorker()

export const useWorkbookWorker = () => {
  useFileWorker()

  const handleGetWorkbook = ({ data }: MessageEvent<WorkbookRequest>) => {
    sheetStateStore.workbook = data.workbook
    sheetStateStore.state =
      data.workbook?.SheetNames[0] ?? sheetStateStore.state
  }

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
    workbookWorker.addEventListener('message', handleGetWorkbook)

    return () => {
      workbookWorker.removeEventListener('message', handleGetWorkbook)
    }
  }, [])

  return workbookWorker
}
