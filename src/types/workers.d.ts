/**
 * @file This file contains the type definitions for the project's web workers API.
 * @module types/workers
 * @name Web Workers
 * @namespace workers
 */

/// <reference lib="webworker" />

/**
 * The base type for the worker request method.
 */
type RequestMethod = string

/**
 * The base request object that is sent to the worker.
 *
 * For the sake of consistency, requests have a `method` property.
 * @remarks This ensures the worker works like dispatching actions to a reducer.
 *
 * The word method was used to with reference of the REST API.
 * @internal
 */
type WorkerRequest<Method extends RequestMethod = string> = {
  method: Method
} & {
  /**
   * The method of the request.
   */
  method: string
}

/**
 * The possible response statuses.
 */
type ResponseStatus = 'fail' | 'ok'

/**
 * The successful response object.
 */
interface WorkerOkResponse {
  /**
   * The request method of the sent request for debugging purposes.
   */
  method: RequestMethod
  /**
   * The status of the response. When the status is `ok`, the response will not have an error object.
   */
  status: 'ok'
}

/**
 * The failed response object.
 */
interface WorkerFailResponse {
  /**
   * The error object that signifies a failed response.
   */
  error: Error
  /**
   * The request method of the sent request for debugging purposes.
   */
  method: RequestMethod
  /**
   * The status of the response. When the status is `fail`, the response will have an error object.
   */
  status: 'fail'
}

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
type WorkerResponse<
  M extends RequestMethod,
  S extends ResponseStatus = ResponseStatus,
> = (WorkerFailResponse | WorkerOkResponse) & {
  method: M
  status: S
}

/**
 * The handler function that takes in the {@link WorkerRequest | request} and returns the response.
 */
type RequestHandler<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
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
  /**
   * The error event.
   */
  error: ErrorEvent
  /**
   * The message event.
   */
  message: MessageEvent<T>
  /**
   * The error message event.
   */
  messageerror: MessageEvent<T>
}

/**
 * The extended worker type with typed request and response based on the event type via the {@link GenericWorkerEventMap | event map}.
 */
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
    // eslint-disable-next-line functional/prefer-immutable-types
    (request: Readonly<Req>, transfer: Transferable[]): void
  }
  removeEventListener: <K extends keyof GenericWorkerEventMap<Res>>(
    type: K,
    listener: (ev: GenericWorkerEventMap<Res>[K]) => void,
    options?: Readonly<EventListenerOptions> | boolean,
  ) => void
}
