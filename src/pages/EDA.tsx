import { Title1 } from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'

const EDA = () => (
  <>
    <Helmet>
      <title>CLEaN Tool - EDA</title>
    </Helmet>
    <Title1>EDA</Title1>
    <Outlet />
  </>
)

export default EDA
