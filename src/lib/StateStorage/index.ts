type Listener<T> = (data: T) => void

interface Stateful<T> {
  get state(): T
  set state(value: T)
  addEventListener(listener: Listener<this>): Listener<this>
  removeEventListener(listener: Listener<this>): void
}

export abstract class StateStorage<T extends string> implements Stateful<T> {
  protected readonly _storageKey: string
  private _state: T
  private _listeners: Listener<this>[] = []

  get state() {
    this._syncState()
    return this._state
  }

  set state(value: T) {
    localStorage.setItem(this._storageKey, value)
    this._syncState()
    this._listeners.forEach((listener) => {
      listener(this)
    })
  }

  constructor(defaultState: T, storageKey: string) {
    this._state = defaultState
    this._storageKey = storageKey
    this.state = this.state || defaultState
  }

  private readonly _syncState = (): void => {
    this._state = (localStorage.getItem(this._storageKey) ?? '') as T
  }

  readonly addEventListener = (listener: (storage: this) => void) => {
    this._listeners.push(listener)

    return listener
  }

  readonly removeEventListener = (listener: (storage: this) => void) => {
    this._listeners = this._listeners.filter((l) => l !== listener)
  }
}
