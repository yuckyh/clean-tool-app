import type { Handle } from '@/types/router'
import { ChildRouteHandler, childRoutes } from './helper'

export interface NavHandle extends Handle {
  childRoutes: ChildRouteHandler
}

export const navHandle: Handle = {
  id: 'navHandle',
  childRoutes,
}

export const progressNavHandle: Handle = {
  id: 'progressNavHandle',
  childRoutes,
}
