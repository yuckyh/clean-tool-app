/**
 * @file Type definitions for Web Workers
 */

/// <reference lib="webworker" />

/**
 * The base request object that is sent to the worker.
 *
 * For the sake of consistency, requests have a `method` property.
 * @remarks This ensures the worker works like dispatching actions to a reducer.
 *
 * The word method was used to with reference of the REST API.
 * @internal
 */
interface WorkerRequest {
  /**
   * The method of the request.
   */
  method: string
}

type ResponseStatus = 'fail' | 'ok'

/**
 * The response object that is sent back to the main thread.
 * @example The two possible response types:
 * ```ts
 * const okResponse: WorkerResponse = {
 *   status: 'ok',
 * }
 *
 * const failResponse: WorkerResponse = {
 *   error: new Error('foo'),
 *   status: 'fail',
 * }
 * ```
 */
type WorkerResponse<S extends ResponseStatus = ResponseStatus> = (
  | {
      /**
       * The error object that signifies a failed response.
       */
      error: Error
      /**
       * The status of the response. When the status is `fail`, the response will have an error object.
       */
      status: 'fail'
    }
  | {
      /**
       * The status of the response. When the status is `ok`, the response will not have an error object.
       */
      status: 'ok'
    }
) & {
  status: S
}

/**
 * The handler function that takes in the {@link WorkerRequest | request} and returns the response.
 */
type RequestHandler<
  Request extends WorkerRequest & { method: Method },
  Response extends WorkerResponse,
  Method extends Request['method'] = Request['method'],
> = (request: Readonly<Request>) => Readonly<Promise<Response> | Response>

/**
 * The controller object that maps the request method to the handler.
 */
type Controller<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = Record<Request['method'], RequestHandler<Request, Response>>

/**
 * The event map for the worker events.
 */
interface GenericWorkerEventMap<T> extends WorkerEventMap {
  error: ErrorEvent
  message: MessageEvent<T>
  messageerror: MessageEvent<T>
}

/**
 * The extended worker type with typed request and response based on the event type via the {@link GenericWorkerEventMap | event map}.
 */
interface RequestWorker<
  Req extends WorkerRequest,
  Res extends BaseWorkerResponse,
> extends Worker {
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
    // eslint-disable-next-line functional/prefer-immutable-types
    (request: Readonly<Req>, transfer: Transferable[]): void
  }
  removeEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: Readonly<EventListenerOptions> | boolean,
  ) => void
}
