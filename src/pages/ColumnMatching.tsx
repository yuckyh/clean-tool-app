import { Form } from 'react-router-dom'

export const Component = () => {
  // useEffect(() => {
  //   void (async () => {
  //     file && console.log(XLSX.read(await file.arrayBuffer()))
  //   })()
  // }, [file])

  console.log()
  return (
    <Form>
      <h1>Column Matching</h1>
    </Form>
  )
}

Component.displayName = 'ColumnMatching'
