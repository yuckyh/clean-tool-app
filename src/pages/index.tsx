import {
  Body1,
  Button,
  Card,
  CardHeader,
  Title1,
  tokens,
} from '@fluentui/react-components'
import { makeStyles, shorthands } from '@fluentui/react-components'
import { useHref, useLinkClickHandler } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    ...shorthands.margin(0, 'auto'),
  },
  card: {
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '20%'),
  },
})

const Home = () => {
  const classes = useClasses()
  const uploadHref = useHref('/upload')
  const handleClick = useLinkClickHandler(uploadHref)

  return (
    <section className={classes.root}>
      <Card className={classes.card} size="large">
        <CardHeader header={<Title1>Home</Title1>}></CardHeader>
        <Body1>To get started,</Body1>
        <Button
          as="a"
          appearance="primary"
          href={uploadHref}
          onClick={handleClick}>
          Upload
        </Button>
        <Body1>or...</Body1>
        <Button>Continue (WIP)</Button>
      </Card>
    </section>
  )
}

export default Home
