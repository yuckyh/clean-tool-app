export const getPersisted = <T extends string>(
  key: string,
  defaultValue: T,
): T => {
  return (localStorage.getItem(key) ?? defaultValue) as T
}

export const setPersisted = <T extends string>(key = '', value: T) => {
  localStorage.setItem(key, value)
}

export const promisedWorker = <
  Req extends WorkerRequest,
  Res extends WorkerResponse,
>(
  type: keyof Omit<GenericWorkerEventMap<Res>, 'error'>,
  worker: RequestWorker<Req, Res>,
  options: AddEventListenerOptions = { once: true },
) =>
  new Promise<GenericWorkerEventMap<Res>[typeof type]>((resolve, reject) => {
    worker.addEventListener(
      type,
      (event) => {
        if (event.data.status === 'fail') {
          reject(event)
        }

        resolve(event)
      },
      options,
    )

    worker.addEventListener(
      'error',
      (event) => {
        reject(event)
      },
      options,
    )
  })

export const curry = <Args extends AnyArray, Return>(
  fn: (...args: [...Args]) => Return,
): Curried<Args, Return> => {
  const passed: unknown[] = []

  const curried = <Needs extends AnyArray>(
    arg: Needs[0],
  ): Curried<Needs, Return> => {
    passed.push(arg)

    return (
      passed.length >= fn.length
        ? fn(...(passed as Args))
        : curried<ExcludeFirst<Needs>>
    ) as Curried<Needs, Return>
  }
  return curried as Curried<Args, Return>
}

export const just = <T>(value: T) => {
  const monad = (<U>(fn?: (value: T) => U) =>
    fn ? just(fn(value)) : value) as JustMonad<T>

  monad.convert = (converter) => converter(value)

  return monad
}

export const list = <A extends AnyArray>(value: A) => {
  const monad = (<T, U extends AsArray<T>>(
    fn?: (
      value: ArrayElement<A>,
      index: number,
      array: AsArray<ArrayElement<A>>,
    ) => T,
  ) =>
    fn
      ? list((value as AsArray<ArrayElement<A>>).map<T>(fn) as U)
      : value) as ListMonad<A>

  monad.convert = (converter) => converter(value)

  return monad
}
