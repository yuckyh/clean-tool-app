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
  messageerror: MessageEvent<T>
  message: MessageEvent<T>
}

interface RequestWorker<Req extends WorkerRequest, Res extends WorkerResponse>
  extends Worker {
  addEventListener<K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void
  removeEventListener<K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void
  postMessage(request: Req, options?: StructuredSerializeOptions): void
  postMessage(request: Req, transfer: Transferable[]): void
}
