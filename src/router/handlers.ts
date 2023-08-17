import type { Handle } from '@/types/router'
import { childRoutes } from './helper'

export interface NavHandle extends Handle {
  childRoutes: Function
}

export const navHandle: Handle = {
  id: 'navHandle',
  childRoutes: childRoutes,
}

export const progressNavHandle: Handle = {
  id: 'progressNavHandle',
  childRoutes: childRoutes,
}
