import { RouteObject, matchRoutes } from 'react-router-dom'
import { routes } from '.'

export type ChildRouteHandler = (route: RouteObject) => RouteObject[]

export const childRoutes: ChildRouteHandler = (route) => {
  return (
    matchRoutes(routes, route.path!)
      ?.pop()
      ?.route!.children?.filter((childRoute) => childRoute.path !== '*') ?? []
  )
}
