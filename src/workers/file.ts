const readFile = async (path: string) => {
  const reader = new FileReader()

  reader.addEventListener('load', (event) => {
    const result = event.target?.result
    console.log(result)
  })
}
