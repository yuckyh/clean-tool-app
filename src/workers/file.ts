/// <reference lib="webworker" />

import { read } from 'xlsx'

const readFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (event) => {
      const result = event.target?.result as ArrayBuffer
      resolve(result)
    })

    reader.addEventListener('error', (event) => {
      reject(event.target?.error)
    })

    reader.readAsArrayBuffer(file)
  })
}

const getWorkbooks = (files: File[]) => {
  const buffers = files.map(async (file: File) => await readFile(file))
  return buffers.map((buffer) => read(buffer))
}

self.addEventListener(
  'message',
  (event) => {
    console.log('Message received from main script')
    const workbooks = getWorkbooks(event.data as File[])
    self.postMessage(workbooks)
  },
  false,
)
