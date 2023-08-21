import {
  RouteObject,
  matchRoutes,
  useLocation,
  useMatches,
} from 'react-router-dom'

import { routes } from './router'
import type { Match, Handle } from '@/types/router'
import { isValidElement } from 'react'

const useHandleMatches = <T extends Handle>(handleId: string): Match<T>[] => {
  const matches = useMatches() as Match<T>[]

  return matches.filter((match) => {
    return match.handle?.id === handleId
  })! as Match<T>[]
}

export const useComponentRoute = <T extends Handle>(
  handleId: string,
): RouteObject => {
  const matches = useHandleMatches<T>(handleId)
  const { pathname } = matches[0]!
  const matchingIds = matches.map((match) => match.id)
  const matchingRoutes = matchRoutes(routes, pathname)?.map(
    (match) => match.route,
  )
  return matchingRoutes?.find((routeMatch) =>
    matchingIds.includes(routeMatch.id!),
  )!
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
