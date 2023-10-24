/// <reference lib="webworker" />

type RequestHandler<
  Request extends WorkerRequest & { method: Method },
  Response extends WorkerResponse,
  Method extends Request['method'] = Request['method'],
> = (request: Request) => Promise<Response> | Response

type Controller<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = Record<Request['method'], RequestHandler<Request, Response>>

interface WorkerRequest {
  method: string
}

type WorkerResponse =
  | {
      status: 'fail'
      error: Error
    }
  | {
      status: 'ok'
    }

interface GenericWorkerEventMap<T> extends WorkerEventMap {
  messageerror: MessageEvent<T>
  message: MessageEvent<T>
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
    (request: Readonly<Req>, transfer: Transferable[]): void
  }
}
