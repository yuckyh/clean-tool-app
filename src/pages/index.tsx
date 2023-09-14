import {
  Button,
  Card,
  CardFooter,
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

// TODO: add another column for visit
// TODO: add dropdown in upload(?) for number of visits
// TODO: write in workbook
// TODO: add download button
// TODO: make download work

export const Component = () => {
  const classes = useClasses()
  const uploadHref = useHref('/upload')
  const handleClick = useLinkClickHandler(uploadHref)

  return (
    <section className={classes.root}>
      <Card className={classes.card} size="large">
        <CardHeader header={<Title1>CLEaN Tool</Title1>}></CardHeader>
        <CardFooter
          action={
            <Button
              as="a"
              appearance="primary"
              href={uploadHref}
              onClick={handleClick}>
              Upload
            </Button>
          }></CardFooter>
      </Card>
    </section>
  )
}

Component.displayName = 'Home'
