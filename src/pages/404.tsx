import { Body1, Link, Title1, makeStyles } from '@fluentui/react-components'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const NotFound = () => {
  const { root } = useStyles()
  return (
    <div className={root}>
      <Title1>404 Not Found</Title1>
      <Body1>The page you are looking for does not exist.</Body1>
      <RouterLink to="/">
        <Link>Go Back to home</Link>
      </RouterLink>
    </div>
  )
}

export default NotFound
