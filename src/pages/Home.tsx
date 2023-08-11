import { Body1, Title1 } from '@fluentui/react-components'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'

const Home = () => (
  <>
    <Helmet>
      <title>CLEaN Tool - Home</title>
    </Helmet>
    {/* <div className="container-sm mx-auto flex flex-col"> */}
    <Title1>Home</Title1>
    <Body1>Welcome</Body1>
    {/* </div> */}
    <Outlet />
  </>
)

export default Home
