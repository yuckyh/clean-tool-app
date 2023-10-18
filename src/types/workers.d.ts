/// <reference lib="webworker" />

type RequestHandler<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = (request: Request) => Promise<Response> | Response

type Controller<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = Record<Request['method'], RequestHandler<Request, Response>>

interface WorkerRequest {
  method: string
}

interface WorkerResponse {
  status: 'fail' | 'ok'
  error?: Error
}

interface GenericWorkerEventMap<T> extends WorkerEventMap {
  messageerror: Readonly<MessageEvent<T>>
  message: Readonly<MessageEvent<T>>
}

interface RequestWorker<Req extends WorkerRequest, Res extends WorkerResponse>
  extends Worker {
  removeEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: Readonly<EventListenerOptions> | boolean,
  ) => void
  addEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: Readonly<AddEventListenerOptions> | boolean,
  ) => void
  postMessage: {
    (
      request: Readonly<Req>,

      options?: Readonly<StructuredSerializeOptions>,
    ): void
    (request: Readonly<Req>, transfer: readonly Readonly<Transferable>[]): void
  }
}
