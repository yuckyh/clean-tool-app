import type { InputProps } from '@fluentui/react-components'
import { Input, makeStyles } from '@fluentui/react-components'
import type { DropEvent, FileRejection } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

interface FileInputProps extends InputProps {
  onDropZoneDrop: (
    acceptedFiles: File[],
    // inputRef: Ref<HTMLInputElement>,
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void
}

const useClasses = makeStyles({
  root: {
    cursor: 'pointer',
  },
  input: {
    width: '100%',
  },
})

const FileInput = ({ onDropZoneDrop, ...props }: FileInputProps) => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: onDropZoneDrop,
    noDragEventsBubbling: true,
  })
  const fileNames = acceptedFiles.map((file) => file.name).join(', ')
  const classes = useClasses()

  return (
    <div {...getRootProps({ className: classes.root })}>
      <input {...getInputProps()} />
      <Input
        {...props}
        placeholder={'Drag and drop or click'}
        value={fileNames}
        className={classes.input}
      />
    </div>
  )
}

export default FileInput
