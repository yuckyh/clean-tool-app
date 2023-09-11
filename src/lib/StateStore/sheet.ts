import type { WorkBook } from 'xlsx'
import { StateStore } from '.'

class SheetStateStore extends StateStore<string> {
  private _workbook?: WorkBook | undefined
  private _sheetNames: string[] = []
  private _sheet = this._workbook?.Sheets[this.state]

  get workbook(): WorkBook | undefined {
    return this._workbook
  }

  set workbook(value: WorkBook | undefined) {
    this._workbook = value
    this._sheetNames = value ? value.SheetNames : []
    this._sheet = this._workbook?.Sheets[this.state]
  }

  get sheet() {
    return this._sheet
  }

  get sheetNames(): string[] {
    return this._sheetNames
  }

  constructor() {
    super('', 'sheetName')
  }
}

export const sheetStateStore = new SheetStateStore()
