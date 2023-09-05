import { StateStorage } from './StateStorage'

class FileStorage extends StateStorage<string> {
  private _file: File = new File([], '')
  constructor() {
    super('', 'fileName')
  }

  get file() {
    return this._file
  }

  set file(file: File) {
    this._file = file
  }
}

export const fileStorage = new FileStorage()
