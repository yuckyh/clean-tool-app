import { StateStore } from '.'

class ColumnStateStore extends StateStore<string> {
  private _columns = new Set<string>()
  private _indices: number[] = []
  private _matches: string[][] = [[]]

  get columns() {
    return this._columns
  }

  get indices() {
    return this._indices
  }

  set indices(indices: number[]) {
    this._indices = indices
    this._columns = new Set(
      this._matches.map((match, i) => match[indices[i] ?? 0] ?? ''),
    )
    this.state = Array.from(this._columns).join(',')
  }

  get matches() {
    return this._matches
  }

  set matches(matches: string[][]) {
    this._matches = matches
  }

  constructor() {
    super('', 'columns')
  }
}

export const columnStateStore = new ColumnStateStore()
