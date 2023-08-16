/* eslint-disable react-refresh/only-export-components */
import Nav from '@/components/Nav'
import { routes } from '@/router'
import { getChildRoutes } from '@/helpers'
import { Outlet, matchRoutes, useLocation } from 'react-router-dom'
import { useState } from 'react'

const EDA = () => {
  const location = useLocation()
  const [route] = useState(matchRoutes(routes, location)!.pop()!.route!)

  return (
    <>
      <Nav navRoutes={getChildRoutes(route)} vertical={true} />
      <Outlet />
    </>
  )
}

export default EDA
