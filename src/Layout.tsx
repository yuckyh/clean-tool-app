import { Outlet } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'

const Layout = () => {
  return (
    <>
      <header>
        <ProgressNav thickness="large" max={1} value={0.5} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
