import { matchRoutes, resolvePath, useLocation } from 'react-router-dom'

import { routes } from './router'
import type { Ref } from 'react'
import { useEffect, useState } from 'react'
import { getPathTitle } from './helpers'
import type {
  ComponentProps,
  ComponentState,
  SlotPropsRecord,
} from '@fluentui/react-components'

// const useHandleMatches = <T extends Handle>(handleId: string): Match<T>[] => {
//   const matches = useMatches().filter((match) => match.handle) as Match<T>[]

//   return matches.filter((match) => {
//     return match.handle.id === handleId
//   })
// }

// const useComponentRoute = <T extends Handle>(
//   handleId: string,
// ): RouteObject | undefined => {
//   const matches = useHandleMatches<T>(handleId)
//   const { pathname } = useResolvedPath('')
//   const matchingIds = matches.map(({ id }) => id)
//   const matchingRoutes = matchRoutes(routes, pathname)
//   return matchingRoutes?.find(({ route }) =>
//     matchingIds.includes(route.id ?? ''),
//   )?.route
// }
// const useChildRoutes = (
//   route: RouteObject,
//   exclusion?: string,
// ): RouteObject[] =>
//   route.children?.filter(
//     (childRoute) =>
//       childRoute.path !== '*' &&
//       resolvePath(childRoute.path ?? route.path ?? '').pathname !== exclusion,
//   ) ?? []

// const useCurrentParentRoute = (parentPath: string) => {
//   return matchRoutes(routes, parentPath)
//     ?.filter(({ route }) => route.children)
//     ?.pop()
// }

export const useChildPaths = (parentPath: string, exclusion?: string) => {
  console.log(parentPath, exclusion)
  return matchRoutes(routes, parentPath)
    ?.filter(({ route }) => route.children)
    .map(({ route }) => route.children)
    .pop()
    ?.filter(
      ({ path }) => resolvePath(path ?? parentPath).pathname !== exclusion,
    )
    .map(({ path }) => path ?? '')
}

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()
  if (path) {
    return getPathTitle(path)
  }
  return getPathTitle(pathname)
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
