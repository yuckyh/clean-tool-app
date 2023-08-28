import {
  matchRoutes,
  resolvePath,
  useHref,
  useLocation,
} from 'react-router-dom'

import { routes } from './router'
import type { Ref } from 'react'
import { useEffect, useState } from 'react'
import { getPathTitle } from './helpers'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'

export const useChildPaths = (parentPath: string, exclusion?: string) => {
  console.log(parentPath, exclusion)
  return matchRoutes(routes, parentPath)
    ?.filter(({ route }) => route.children)
    .map(({ route }) => route.children)
    .pop()
    ?.filter(
      ({ path }) => resolvePath(path ?? parentPath).pathname !== exclusion,
    )
    .map(({ path }) => resolvePath(path ?? ''))
}

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()
  return getPathTitle(useHref(path ?? pathname))
}

export const useThemePreference = () => {
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
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
