import type { PropsWithChildren } from 'react'
import GlobalFluentProvider from '@/components/GlobalFluentProvider'
import { useFileName, useFileWorker } from '@/hooks'
import { FileNameContext, FileWorkerContext } from '@/contexts'

const Providers = ({ children }: PropsWithChildren) => {
  const fileWorker = useFileWorker()
  const fileName = useFileName()
  return (
    <GlobalFluentProvider>
      <FileWorkerContext.Provider value={fileWorker}>
        <FileNameContext.Provider value={fileName}>
          {children}
        </FileNameContext.Provider>
      </FileWorkerContext.Provider>
    </GlobalFluentProvider>
  )
}

export default Providers
