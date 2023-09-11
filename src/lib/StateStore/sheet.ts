import type { WorkBook } from 'xlsx'
import { StateStore } from '.'

class SheetStateStore extends StateStore<string> {
  private _workbook?: WorkBook | undefined
  private _sheetNames: string[] = []
  private _sheet = this._workbook?.Sheets[this.state]
  private _columns: string[] = []

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

  get columns(): string[] {
    return this._columns
  }

  set columns(value: string[]) {
    this._columns = value
  }

  constructor() {
    super('', 'sheetName')
  }
}

export const sheetStateStore = new SheetStateStore()
