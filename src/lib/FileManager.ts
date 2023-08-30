import { StateManager } from './StateManager'

class FileManager extends StateManager<string> {
  constructor() {
    super('', 'fileState')
  }
}

export const fileManager = new FileManager()
