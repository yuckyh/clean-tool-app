import { Body1, Link, Title1, makeStyles } from '@fluentui/react-components'
import { useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
  },
})

export const Component = () => {
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
