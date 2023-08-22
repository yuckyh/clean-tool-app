import { Form } from 'react-router-dom'
import FileWorker from '@/workers/file?worker'
import FileInput from '@/components/FileInput'
import { useCallback, useMemo } from 'react'
import {
  Card,
  CardHeader,
  Field,
  Title1,
  makeStyles,
  shorthands,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    ...shorthands.margin(0, 'auto'),
  },
  card: {
    // width: 'fit-content',
    // ...shorthands.margin(0, 'auto'),
  },
})

const Upload = () => {
  const fileWorker = useMemo(() => {
    const fileWorker = new FileWorker()
    fileWorker.addEventListener(
      'message',
      (event) => {
        console.log(
          'This log is sent by main thread after receiving message from worker thread.',
        )
        console.log(event.data)
      },
      false,
    )
    return fileWorker
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]): void => {
      fileWorker.postMessage(acceptedFiles)
    },
    [fileWorker],
  )

  const classes = useClasses()

  return (
    <section className={classes.root}>
      <Card className={classes.card}>
        <CardHeader header={<Title1>Upload</Title1>} />
        <Form>
          <Field label="Upload Data" required={true}>
            <FileInput onDropZoneDrop={onDrop} appearance="filled-darker" />
          </Field>
        </Form>
      </Card>
    </section>
  )
}

export default Upload
