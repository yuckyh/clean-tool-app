/**
 * @file This file contains the filter input component.
 * @module pages/EDA/Variable/FilterInput
 */

import type { InputProps } from '@fluentui/react-components'

import { Field, Input, makeStyles } from '@fluentui/react-components'

const useClasses = makeStyles({
  input: {
    minWidth: '150px',
  },
})

/**
 *
 */
interface Props {
  /**
   *
   */
  handleChange: InputProps['onChange']
  /**
   *
   */
  label: string
  /**
   *
   */
  value: string
}

/**
 * The filter input component is used to filter the data grid.
 * @param props - The {@link Props props} for the component.
 * @param props.handleChange - The change handler for the input.
 * @param props.label - The label for the input.
 * @param props.value - The value for the input.
 * @returns The component object.
 * @example
 * ```tsx
 *  <FilterInput
 *    handleChange={handleChange}
 *    label={label}
 *    value={value} />
 * ```
 */
export default function FilterInput({
  handleChange,
  label,
  value,
}: Readonly<Props>) {
  const classes = useClasses()

  return (
    <Field label={label}>
      <Input
        appearance="filled-darker"
        className={classes.input}
        onChange={handleChange}
        value={value}
      />
    </Field>
  )
}
