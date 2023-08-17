import type { NavHandler } from '@/types/router'

export const navHandler: NavHandler = {
  childRoutes(route) {
    return route.children?.filter((childRoute) => childRoute.path !== '*') ?? []
  },
}
