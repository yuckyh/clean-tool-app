export const getRootHandle = () => navigator.storage.getDirectory()

export const getRootFileHandle = async (fileName: string, create?: boolean) => {
  try {
    const rootHandle = await getRootHandle()
    return await rootHandle.getFileHandle(fileName, {
      create,
    })
  } catch (error) {
    console.log(error)
  }
}

export const writeFile = async (file: File, handle: FileSystemFileHandle) => {
  const writableStream = await handle.createWritable()
  await writableStream.write(file)
  void writableStream.close()
}
