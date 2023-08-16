import { isValidElement } from 'react'
import { RouteObject } from 'react-router-dom'

export const pascalToTitle = (pascalString: string) => {
  const titleString = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2')
  return titleString.charAt(0).toUpperCase() + titleString.slice(1)
}

export const getRouteName = (route: RouteObject): string => {
  if (!route || !isValidElement(route.element)) {
    return 'No Component'
  }

  if (typeof route.element.type === 'string') {
    return pascalToTitle(route.element.type)
  }

  if (!route.element.key) {
    return pascalToTitle(route.element.type.name)
  }

  return pascalToTitle(route.element.key?.toString() ?? '')
}

export const getChildRoutes = (route: RouteObject): RouteObject[] => {
  return route.children?.filter((childRoute) => childRoute.path !== '*') ?? []
}
