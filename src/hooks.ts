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

import { routes } from '@/Router'
import { getPathTitle } from '@/helpers'
import FileWorker from '@/workers/file?worker'
import type { FileRequest, FileResponse } from '@/workers/file'
import { fileManager } from '@/lib/FileManager'

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
    const fileWorker = new FileWorker()

    // Response handler
    fileWorker.addEventListener(
      'message',
      ({ data }: MessageEvent<FileResponse>) => {
        const { action, fileName } = data
        console.log(data)
        fileManager.state = action === 'delete' ? '' : fileName
      },
      false,
    )

    // Init request
    const request: FileRequest = {
      method: 'index',
      fileName: fileManager.state,
    }
    fileWorker.postMessage(request)

    return fileWorker
  }, [])

  useEffect(() => {
    return () => {
      fileWorker.terminate()
    }
  }, [fileWorker])

  return fileWorker
}

export const useFileName = () => {
  const [fileName, setFileName] = useState(fileManager.state)

  useEffect(() => {
    const listener = fileManager.addStateListener((state) => {
      console.log(state)
      setFileName(state)
    })

    return () => {
      fileManager.removeStateListener(listener)
    }
  }, [])

  return fileName
}
