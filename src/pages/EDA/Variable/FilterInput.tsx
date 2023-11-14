import type { InputProps } from '@fluentui/react-components'

import { Field, Input, makeStyles } from '@fluentui/react-components'

const useClasses = makeStyles({
  input: {
    minWidth: '150px',
  },
})

interface Props {
  handleChange: InputProps['onChange']
  label: string
  value: string
}

/**
 *
 * @param props
 * @param props.handleChange
 * @param props.label
 * @param props.value
 * @returns
 * @example
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
