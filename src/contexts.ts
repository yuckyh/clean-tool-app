import { createContext } from 'react'
import FileWorker from '@/workers/file?worker'

export const FileWorkerContext = createContext<Worker>(new FileWorker())
export const FileNameContext = createContext<string>('')
