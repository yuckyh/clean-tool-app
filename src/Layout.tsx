import { TabList } from '@fluentui/react-components'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <aside>
        <TabList>
          <Link to="/">Test</Link>
        </TabList>
      </aside>
      <main className="grid-cols-3">
        <Outlet />
      </main>
      <aside></aside>
    </>
  )
}

export default Layout
