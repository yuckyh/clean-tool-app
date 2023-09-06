import { StateStorage } from '.'

class FileStateStorage extends StateStorage<string> {
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

export const fileStateStorage = new FileStateStorage()
