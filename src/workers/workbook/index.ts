import type { WorkBook } from 'xlsx'

interface WorkBookRequest {
  workbook: WorkBook
}

const main = async ({ data }: MessageEvent<WorkBookRequest>) => {
  //   const { method } = data

  //   postMessage(await controller[method](data))
  await new Promise((resolve) => {
    resolve('yum')
  })
  postMessage('This is from the workbook worker')
}

addEventListener(
  'message',
  (event) => {
    void main(event as MessageEvent<WorkBookRequest>)
  },
  false,
)
