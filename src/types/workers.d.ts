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
      error: Error
      status: 'fail'
    }
  | {
      status: 'ok'
    }

interface GenericWorkerEventMap<T> extends WorkerEventMap {
  message: MessageEvent<T>
  messageerror: MessageEvent<T>
}

interface RequestWorker<Req extends WorkerRequest, Res extends WorkerResponse>
  extends Worker {
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
  removeEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: Readonly<EventListenerOptions> | boolean,
  ) => void
}
