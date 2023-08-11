import { Title1 } from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'

const Explorer = () => (
  <>
    <Helmet>
      <title>CLEaN Tool - {import.meta.url}</title>
    </Helmet>
    <section></section>
    <Outlet />
  </>
)

export default Explorer
