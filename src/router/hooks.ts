import type { Match, NavHandler } from '@/types/router'

import { routes } from '@/router'
import { RouteObject, matchRoutes, useMatches } from 'react-router-dom'

export const useChildRoutesHandler = (): [RouteObject[], Match] => {
  const matches = useMatches()

  const handlerMatches = matches.filter((match) => match.handle as NavHandler)!

  const handlerMatch = handlerMatches[0]!
  console.log(handlerMatches, handlerMatch)
  const handlerRoute = matchRoutes(routes, handlerMatch.pathname)?.pop()?.route!
  const navHandler: NavHandler = handlerMatch.handle as NavHandler
  return [navHandler.childRoutes(handlerRoute), handlerMatch]
}
