/* eslint-disable react-refresh/only-export-components */
import Nav from '@/components/Nav'
import { Outlet } from 'react-router-dom'

const EDA = () => (
  <>
    <Nav vertical={true} />
    <Outlet />
  </>
)

export default EDA
