import { StateStorage } from './StateStorage'

class SheetNameStorage extends StateStorage<string> {
  constructor() {
    super('', 'sheetName')
  }
}

export const sheetNameStorage = new SheetNameStorage()
