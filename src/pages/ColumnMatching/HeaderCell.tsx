/**
 * @file This file contains the header cell component for the preview data grid.
 * @module components/ColumnMatching/HeaderCell
 */

import {
  Caption1,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
})

/**
 * The props for {@link HeaderCell}.
 */
interface Props {
  /**
   *
   */
  header: string
  /**
   *
   */
  subtitle: string
}

/**
 * This function renders the header cell for the preview data grid.
 * @param props - The {@link Props props} for the component.
 * @param props.header - The header text.
 * @param props.subtitle - The header subtitle text.
 * @returns The component object.
 * @category Component
 * @example
 * ```tsx
 *  <HeaderCell header={header} subtitle={subtitle} />
 * ```
 */
export default function HeaderCell({ header, subtitle }: Readonly<Props>) {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}
