import { StateStorage } from '.'

export enum ProgressState {
  NONE = 'none',
  UPLOADED = 'uploaded',
  MATCHED = 'matched',
  EXPLORED = 'explored',
  DOWNLOADED = 'downloaded',
}
type AllowedProgressPath = Record<ProgressState, string[]>

class ProgressStateStorage extends StateStorage<ProgressState> {
  private readonly _allowedPaths: AllowedProgressPath = {
    [ProgressState.NONE]: ['/upload'],
    [ProgressState.UPLOADED]: ['/upload', '/column-matching'],
    [ProgressState.MATCHED]: ['/upload', '/column-matching', '/EDA'],
    [ProgressState.EXPLORED]: [
      '/upload',
      '/column-matching',
      '/EDA',
      '/download',
    ],
    [ProgressState.DOWNLOADED]: [
      '/upload',
      '/column-matching',
      '/EDA',
      '/download',
    ],
  }

  get allowedPath() {
    return ['/', ...this._allowedPaths[this.state]]
  }

  constructor() {
    super(ProgressState.NONE, 'progress')
  }
}

export const progressStateStorage = new ProgressStateStorage()
