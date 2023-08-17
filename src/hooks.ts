import {
  RouteObject,
  matchRoutes,
  useLocation,
  useMatches,
} from 'react-router-dom'

import { routes } from './router'
import type { Match } from '@/types/router'
import { isValidElement } from 'react'

const useHandleMatches = <T extends Match>(handleId: string): T[] => {
  const matches = useMatches()

  return matches.filter(
    (match) => (match as T)?.handle?.id === handleId,
  )! as T[]
}

export const useComponentRoute = <T extends Match>(
  handleId: string,
): RouteObject => {
  const matches = useHandleMatches<T>(handleId)

  console.log(matches)

  return matchRoutes(routes, matches.pop()!.pathname)?.pop()?.route!
}

export const useCurrentRoute = () => {
  const location = useLocation()

  return matchRoutes(routes, location.pathname)?.pop()?.route!
}

export const useChildRoutes = (route: RouteObject): RouteObject[] => {
  return route.children?.filter((childRoute) => childRoute.path !== '*') ?? []
}

export const useRouteName = (route: RouteObject): string => {
  if (!isValidElement(route?.element)) {
    return 'No Component'
  }

  if (typeof route.element.type === 'string') {
    return route.element.type
  }

  return route.element.key?.toString() ?? route.element.type.name
}
