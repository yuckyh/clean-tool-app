import { RouteObject } from 'react-router-dom'

export declare interface Match {
  id: string
  pathname: string
  params: Params<string>
  data: unknown
  handle: unknown
}

export declare interface NavHandler {
  childRoutes(route: RouteObject): RouteObject[]
}
