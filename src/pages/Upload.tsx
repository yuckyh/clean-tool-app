import { useCallback, useContext } from 'react'
import { Form } from 'react-router-dom'
import FileInput from '@/components/FileInput'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Field,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'
import { fileManager } from '@/lib/FileManager'
import { type FileRequest } from '@/workers/file'
import { FileNameContext, FileWorkerContext } from '@/contexts'

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
  body: {
    display: 'grid',
    ...shorthands.gap(0, '8px'),
  },
  actions: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    ...shorthands.gap('8px', 0),
  },
})

export const Component = () => {
  const fileWorker = useContext(FileWorkerContext)
  const fileName = useContext(FileNameContext)

  const handleFileDrop = useCallback(
    (acceptedFiles: File[]): void => {
      const file = acceptedFiles[0]

      void (async () => {
        const fileBuffer = await file.arrayBuffer()
        console.log(fileBuffer)

        const request: FileRequest = {
          method: 'post',
          fileBuffer,
          fileOptions: {
            type: file.type,
          },
          fileName: file.name,
        }

        fileWorker.postMessage(request, [fileBuffer])
      })()
    },
    [fileWorker],
  )

  const handleResetClick = useCallback(() => {
    const request: FileRequest = {
      method: 'delete',
      fileName: fileManager.state,
    }
    fileWorker.postMessage(request)
  }, [fileWorker])

  const zoneOptions: DropzoneOptions = {
    accept: {
      'text/plain': ['.csv'],
      'text/csv': ['.csv'],
      'text/x-csv': ['.csv'],
      'text/comma-separated-values': ['.csv'],
      'text/x-comma-separated-values': ['.csv'],
      'application/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.google-apps.spreadsheet': ['.gsheet'],
    },
    maxFiles: 1,
    onDrop: handleFileDrop,
    disabled: !!fileName,
  }

  const classes = useClasses()

  return (
    <Form className={classes.root} action="/column-matching" method="POST">
      <Card className={classes.card}>
        <CardHeader header={<Title1>Upload</Title1>} />
        <Field label="Upload Data" required={true}>
          <FileInput
            zoneOptions={zoneOptions}
            appearance="filled-darker"
            value={fileName}
          />
        </Field>
        <CardFooter
          action={
            <div className={classes.actions}>
              <Button disabled={!fileName} onClick={handleResetClick}>
                Reset
              </Button>
              <Button appearance="primary" disabled={!fileName} type="submit">
                Proceed
              </Button>
            </div>
          }
        />
      </Card>
    </Form>
  )
}

Component.displayName = 'Upload'
