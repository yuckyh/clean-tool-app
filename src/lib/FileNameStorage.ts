import { StateStorage } from './StateStorage'

class FileNameStorage extends StateStorage<string> {
  constructor() {
    super('', 'fileState')
  }
}

export const fileNameStorage = new FileNameStorage()
