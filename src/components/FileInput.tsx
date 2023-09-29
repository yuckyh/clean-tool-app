import type { InputProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'

import { Input, makeStyles } from '@fluentui/react-components'
import { useDropzone } from 'react-dropzone'

interface FileInputProps extends InputProps {
  zoneOptions?: DropzoneOptions
}

const useClasses = makeStyles({
  input: {
    width: '100%',
  },
  root: {
    cursor: 'pointer',
  },
})

const FileInput = ({ value, zoneOptions, ...props }: FileInputProps) => {
  const { acceptedFiles, getInputProps, getRootProps } =
    useDropzone(zoneOptions)
  const fileNames = acceptedFiles.map((file) => file.name).join(', ')
  const classes = useClasses()

  return (
    <div {...getRootProps({ className: classes.root })}>
      <input {...getInputProps()} />
      <Input
        {...props}
        className={classes.input}
        disabled={zoneOptions?.disabled}
        placeholder={'Drag and drop or click to upload'}
        value={value ?? fileNames}
      />
    </div>
  )
}

export default FileInput
