import Nav from '@/components/Nav'
import { Outlet } from 'react-router-dom'

export const Component = () => (
  <>
    <Nav vertical={true} />
    <Outlet />
  </>
)

Component.displayName = 'EDA'
