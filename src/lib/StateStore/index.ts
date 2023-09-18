type Listener<T> = (data: T) => void

interface HasState<T> {
  get state(): T
  set state(value: T)
}

interface CanSubscribe {
  subscribe(listener: Listener<this>): () => void
}

interface CanReset<T> {
  reset(defaultValue: T): void
}

export abstract class StateStore<T extends string>
  implements HasState<T>, CanReset<T>, CanSubscribe
{
  private _listeners: Listener<this>[] = []
  private _state
  private readonly _storageKey

  private _syncState = () => {
    this._state = (localStorage.getItem(this._storageKey) ?? '') as T
  }

  protected addEventListener = (listener: Listener<this>) => {
    this._listeners.push(listener)

    return listener
  }

  protected removeEventListener = (listener: Listener<this>) => {
    this._listeners = this._listeners.filter((l) => l !== listener)
  }

  reset = (defaultState: T) => {
    this.state = defaultState
    this._listeners = []
  }

  readonly subscribe = (listener: Listener<this>) => {
    this.addEventListener(listener)

    return () => {
      this.removeEventListener(listener)
    }
  }

  constructor(defaultState: T, storageKey: string) {
    this._storageKey = storageKey
    this._state = this.state || defaultState
    window.addEventListener('storage', ({ key }) => {
      if (key === null) {
        this.reset(defaultState)
      }
    })
  }

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
}
