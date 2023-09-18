import { StateStore } from '.'

class ColumnStateStore extends StateStore<string> {
  private _columns = new Set<string>()

  constructor(key: string) {
    super('', key)
    this._columns = new Set(this.state.split(','))
    this.addEventListener(({ state }) => {
      this._columns = new Set(state.split(','))
    })
  }

  get columns() {
    return this._columns
  }
}

export const columnStateStore = new ColumnStateStore('columns')
export const originalColumnStateStore = new ColumnStateStore('originalColumns')
