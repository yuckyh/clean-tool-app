import type { InputProps } from '@fluentui/react-components'

import { Field, Input, makeStyles } from '@fluentui/react-components'

interface FilterInputProps {
  handleChange: InputProps['onChange']
  label: string
  value: string
}

const useClasses = makeStyles({
  input: {
    minWidth: '150px',
  },
})

export default function FilterInput({
  handleChange,
  label,
  value,
}: FilterInputProps) {
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
