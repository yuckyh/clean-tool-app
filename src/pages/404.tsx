import { makeStyles, Title1, Body1, Link } from '@fluentui/react-components'
import { useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    display: 'flex',
  },
})

// eslint-disable-next-line import/prefer-default-export
export function Component() {
  const classes = useClasses()

  const href = useHref('/')

  return (
    <div className={classes.root}>
      <Title1>404 Not Found</Title1>
      <Body1>The page you are looking for does not exist.</Body1>
      <Link href={href}>Return to home</Link>
    </div>
  )
}

Component.displayName = '404'
