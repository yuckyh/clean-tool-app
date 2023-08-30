type Listener<T> = (data: T) => void

interface Stateful<T> {
  get state(): T
  set state(value: T)
  get listener(): Listener<T> | undefined
  addStateListener(listener: Listener<T>): Listener<T>
  removeStateListener(listener: Listener<T>): void
}

export abstract class StateManager<T extends string> implements Stateful<T> {
  protected readonly _storageKey: string
  private _state: T
  private _listener?: Listener<T>

  get state() {
    this._syncState()
    return this._state
  }

  set state(value: T) {
    localStorage.setItem(this._storageKey, value)
    this._syncState()
    this._listener && this._listener(value)
  }

  get listener() {
    return this._listener
  }

  constructor(state: T, storageKey: string) {
    this._state = state
    this._storageKey = storageKey
    this.state = this.state !== state ? this.state : state
  }

  private readonly _syncState = (): void => {
    this._state = localStorage.getItem(this._storageKey) as T
  }

  readonly addStateListener = (listener: (state: T) => void) => {
    this._listener = listener

    return this._listener
  }

  readonly removeStateListener = (listener: (state: T) => void) => {
    this._listener = listener

    delete this._listener
  }
}
