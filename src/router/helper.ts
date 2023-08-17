import { RouteObject, matchRoutes } from 'react-router-dom'
import { routes } from '.'

export const childRoutes = (route: RouteObject): RouteObject[] => {
  return (
    matchRoutes(routes, route.path!)
      ?.pop()
      ?.route!.children?.filter((childRoute) => childRoute.path !== '*') ?? []
  )
}
