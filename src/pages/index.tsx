/**
 * @file This file contains the home page component.
 */

/* eslint-disable
  functional/immutable-data
*/
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useHref, useLinkClickHandler } from 'react-router-dom'

const useClasses = makeStyles({
  card: {
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '20%'),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    ...shorthands.margin(0, 'auto'),
  },
})

/**
 * The home page.
 * This page is simply used to navigate to the upload page
 * @todo Add a quick introduction text to the tool in this page
 * @returns The component object.
 * @category Page
 * @example
 * ```tsx
 *  <Route lazy={defaultLazyComponent(import('../pages'))} />
 * ```
 */
export default function Home() {
  const classes = useClasses()

  const uploadHref = useHref('/upload')

  const handleClick = useLinkClickHandler('/upload')

  return (
    <section className={classes.root}>
      <Card className={classes.card} size="large">
        <CardHeader header={<Title1>CLEaN Tool</Title1>} />
        <CardFooter
          action={
            <Button
              appearance="primary"
              as="a"
              href={uploadHref}
              onClick={handleClick}>
              Upload
            </Button>
          }
        />
      </Card>
    </section>
  )
}

Home.displayName = 'Home'
