type Listener<T> = (data: T) => void

interface Stateful<T> {
  get state(): T
  set state(value: T)
}

interface Subscriptable {
  subscribe(listener: Listener<this>): () => void
}

export abstract class StateStore<T extends string>
  implements Stateful<T>, Subscriptable
{
  private readonly _storageKey: string
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

  private _syncState = (): void => {
    this._state = (localStorage.getItem(this._storageKey) ?? '') as T
  }

  protected addEventListener = (listener: Listener<this>) => {
    this._listeners.push(listener)

    return listener
  }

  protected removeEventListener = (listener: Listener<this>) => {
    this._listeners = this._listeners.filter((l) => l !== listener)
  }

  readonly subscribe = (listener: Listener<this>) => {
    this.addEventListener(listener)

    return () => {
      this.removeEventListener(listener)
    }
  }
}
