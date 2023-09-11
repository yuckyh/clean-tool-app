import { StateStore } from '.'

class FileStateStore extends StateStore<string> {
  private _file: File = new File([], '')
  get file() {
    return this._file
  }

  set file(file: File) {
    this._file = file
  }

  constructor() {
    super('', 'fileName')
  }
}

export const fileStateStore = new FileStateStore()
