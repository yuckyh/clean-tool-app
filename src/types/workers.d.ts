/// <reference lib="webworker" />

type RequestHandler<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = (request: Request) => Promise<Response> | Response

type Controller<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = Record<Request['method'], RequestHandler<Request, Response>>

type WorkerRequest = readonly {
  method: string
}

type WorkerResponse = readonly {
  status: 'fail' | 'ok'
  error?: Error
}

interface GenericWorkerEventMap<T> extends WorkerEventMap {
  messageerror: MessageEvent<T>
  message: MessageEvent<T>
}

interface RequestWorker<Req extends WorkerRequest, Res extends WorkerResponse>
  extends Worker {
  removeEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => undefined,
    options?: EventListenerOptions | boolean,
  ) => undefined
  addEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => undefined,
    options?: AddEventListenerOptions | boolean,
  ) => undefined
  postMessage: (request: Req, options?: StructuredSerializeOptions) => undefined
  postMessage: (request: Req, transfer: Transferable[]) => undefined
}
