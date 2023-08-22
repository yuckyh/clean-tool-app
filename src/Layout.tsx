import { Outlet } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  header: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalXXXL),
  },
})

const Layout = () => {
  const classes = useClasses()

  return (
    <>
      <header className={classes.header}>
        <ProgressNav thickness="large" />
      </header>
      <main className={classes.main}>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
