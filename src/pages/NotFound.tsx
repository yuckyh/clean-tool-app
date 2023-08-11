import { Body1, Link, Title1 } from '@fluentui/react-components'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <Title1>404 Not Found</Title1>
    <Body1>The page you are looking for does not exist.</Body1>
    <RouterLink to="/">
      <Link>Go Back to home</Link>
    </RouterLink>
  </div>
)

export default NotFound
