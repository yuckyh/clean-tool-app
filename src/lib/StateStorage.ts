type Listener<T> = (data: T) => void

interface Stateful<T> {
  get state(): T
  set state(value: T)
  addStateListener(listener: Listener<T>): Listener<T>
  removeStateListener(listener: Listener<T>): void
}

export abstract class StateStorage<T extends string> implements Stateful<T> {
  protected readonly _storageKey: string
  private _state: T
  private _listeners: Listener<T>[] = []

  get state() {
    this._syncState()
    return this._state
  }

  set state(value: T) {
    localStorage.setItem(this._storageKey, value)
    this._syncState()
    this._listeners.forEach((listener) => {
      listener(value)
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

  readonly addStateListener = (listener: (state: T) => void) => {
    this._listeners.push(listener)

    return listener
  }

  readonly removeStateListener = (listener: (state: T) => void) => {
    this._listeners = this._listeners.filter((l) => l !== listener)
  }
}
