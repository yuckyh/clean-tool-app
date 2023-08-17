/* eslint-disable react-refresh/only-export-components */
import Nav from '@/components/Nav'
import { Outlet } from 'react-router-dom'

const EDA = () => {
  // console.log(matchRoutes(routes, location)!.pop()!.route!)

  return (
    <>
      <Nav vertical={true} />
      <Outlet />
    </>
  )
}

export default EDA
