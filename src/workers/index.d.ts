/// <reference lib="webworker" />

export type RequestHandler<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = (request: Request) => Promise<Response>

export type Controller<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = Record<Request['method'], RequestHandler<Request, Response>>

export interface WorkerRequest {
  method: string
}

export interface WorkerResponse {
  error?: Error
  status: 'fail' | 'ok'
}

interface GenericWorkerEventMap<T> extends WorkerEventMap {
  message: MessageEvent<T>
  messageerror: MessageEvent<T>
}

export interface WorkerType<
  Req extends WorkerRequest,
  Res extends WorkerResponse,
> extends Worker {
  addEventListener<K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void
  postMessage(request: Req, options?: StructuredSerializeOptions): void
  postMessage(request: Req, transfer: Transferable[]): void
  removeEventListener<K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (this: Worker, ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void
}
