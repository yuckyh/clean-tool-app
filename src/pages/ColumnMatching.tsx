import { ProgressState, progressManager } from '@/lib/ProgressManager'
import { Form, type ActionFunction } from 'react-router-dom'

export const Component = () => {
  return (
    <Form>
      <h1>Column Matching</h1>
    </Form>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const action: ActionFunction = (args) => {
  console.log(args)
  progressManager.state = ProgressState.UPLOADED
  return { status: 200 }
}

Component.displayName = 'ColumnMatching'
