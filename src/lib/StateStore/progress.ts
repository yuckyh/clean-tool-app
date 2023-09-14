import { StateStore } from '.'

export enum ProgressState {
  NONE = 'none',
  UPLOADED = 'uploaded',
  MATCHED = 'matched',
  EXPLORED = 'explored',
  DOWNLOADED = 'downloaded',
}
type AllowedProgressPath = Record<ProgressState, string[]>

class ProgressStateStore extends StateStore<ProgressState> {
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

  private _allowedPath = ['/', ...this._allowedPaths[this.state]]

  get allowedPath() {
    return this._allowedPath
  }

  constructor() {
    super(ProgressState.NONE, 'progress')
    this.addEventListener(({ state }) => {
      this._allowedPath = ['/', ...this._allowedPaths[state]]
    })
  }
}

export const progressStateStore = new ProgressStateStore()
