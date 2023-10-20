import type { InputProps } from '@fluentui/react-components'
import { makeStyles, Field, Input } from '@fluentui/react-components'

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

// eslint-disable-next-line functional/functional-parameters
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
