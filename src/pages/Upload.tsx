import { Field, Input } from '@fluentui/react-components'
import { Form } from 'react-router-dom'

const Upload = () => {
  // const fileInput = <input type="file" />
  return (
    <Form>
      <Field>
        <Input type="file" appearance="filled-darker-shadow" />
      </Field>
    </Form>
  )
}

export default Upload
