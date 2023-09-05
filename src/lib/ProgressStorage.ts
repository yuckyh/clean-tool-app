import { StateStorage } from './StateStorage'

export enum ProgressState {
  NONE = 'none',
  UPLOADED = 'uploaded',
  MATCHED = 'matched',
  EXPLORED = 'explored',
  DOWNLOADED = 'downloaded',
}
type AllowedProgressPath = Record<ProgressState, string[]>

class ProgressStorage extends StateStorage<ProgressState> {
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
    super(ProgressState.NONE, 'progressState')
  }
}

export const progressStorage = new ProgressStorage()
