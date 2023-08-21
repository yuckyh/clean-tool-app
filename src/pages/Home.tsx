import { Body1, Button, Card, Title1 } from '@fluentui/react-components'
import {
  makeStyles,
  webDarkTheme,
  shorthands,
} from '@fluentui/react-components'
import { useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(webDarkTheme.spacingVerticalXXXL),
  },
  homeCard: {
    width: 'fit-content',
    ...shorthands.margin(0, 'auto'),
  },
})

const Home = () => {
  const classes = useClasses()
  const edaHref = useHref('/eda')

  return (
    <section className={classes.root}>
      <Title1>Home</Title1>
      <Card className={classes.homeCard}>
        <Body1>To get started,</Body1>
        <Button as="a" href={edaHref} appearance="primary">
          Upload
        </Button>
        <Body1>or...</Body1>
        <Button>Continue (WIP)</Button>
      </Card>
    </section>
  )
}

export default Home
