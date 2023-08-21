import { Outlet } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'

const Layout = () => {
  return (
    <>
      <header>
        <ProgressNav thickness="large" />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
