import { Title1 } from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>CLEaN Tool - Home</title>
      </Helmet>
      <Title1>Home</Title1>
      <Outlet />
    </>
  )
}

export default Home
