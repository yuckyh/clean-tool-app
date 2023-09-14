/// <reference lib="webworker" />

export type RequestHandler<
  Request extends WorkerRequest,
  Response extends WorkerResponse,
> = (request: Request) => Promise<Response>

export type Controller<
  Request extends RequestHandler,
  Handler extends RequestHandler<Request>,
> = Record<Request['method'], Handler>

export interface WorkerRequest {
  method: string
}

export interface WorkerResponse {
  action: 'init' | 'create' | 'sync' | 'overwrite' | 'delete' | 'fail' | 'get'
}
