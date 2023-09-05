import { StateStorage } from './StateStorage'

class SheetNameStorage extends StateStorage<string> {
  constructor() {
    super('', 'sheetState')
  }
}

export const sheetNameStorage = new SheetNameStorage()
