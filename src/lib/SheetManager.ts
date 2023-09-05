import { StateManager } from './StateManager'

class SheetManager extends StateManager<string> {
  constructor() {
    super('', 'sheetState')
  }
}

export const sheetManager = new SheetManager()
