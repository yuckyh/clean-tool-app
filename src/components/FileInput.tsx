import type { InputProps } from '@fluentui/react-components'
import { Input, makeStyles } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

interface FileInputProps extends InputProps {
  zoneOptions?: DropzoneOptions
}

const useClasses = makeStyles({
  root: {
    cursor: 'pointer',
  },
  input: {
    width: '100%',
  },
})

const FileInput = ({ zoneOptions, value, ...props }: FileInputProps) => {
  const { getRootProps, getInputProps, acceptedFiles } =
    useDropzone(zoneOptions)
  const fileNames = acceptedFiles.map((file) => file.name).join(', ')
  const classes = useClasses()

  return (
    <div {...getRootProps({ className: classes.root })}>
      <input {...getInputProps()} />
      <Input
        {...props}
        placeholder={'Drag and drop or click to upload'}
        value={value ?? fileNames}
        className={classes.input}
        disabled={zoneOptions?.disabled}
      />
    </div>
  )
}

export default FileInput
