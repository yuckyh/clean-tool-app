# Module: types/workers

## Table of contents

### Interfaces

- [GenericWorkerEventMap](../wiki/types.workers.GenericWorkerEventMap)
- [RequestWorker](../wiki/types.workers.RequestWorker)
- [WorkerRequest](../wiki/types.workers.WorkerRequest)

### Type Aliases

- [Controller](../wiki/types.workers#controller)
- [RequestHandler](../wiki/types.workers#requesthandler)
- [WorkerResponse](../wiki/types.workers#workerresponse)

## Type Aliases

### Controller

Ƭ **Controller**<`Request`, `Response`\>: `Record`<`Request`[``"method"``], [`RequestHandler`](../wiki/types.workers#requesthandler)<`Request`, `Response`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Request` | extends [`WorkerRequest`](../wiki/types.workers.WorkerRequest) |
| `Response` | extends [`WorkerResponse`](../wiki/types.workers#workerresponse) |

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:9](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L9)

___

### RequestHandler

Ƭ **RequestHandler**<`Request`, `Response`, `Method`\>: (`request`: `Request`) => `Promise`<`Response`\> \| `Response`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Request` | extends [`WorkerRequest`](../wiki/types.workers.WorkerRequest) & { `method`: `Method`  } |
| `Response` | extends [`WorkerResponse`](../wiki/types.workers#workerresponse) |
| `Method` | extends `Request`[``"method"``] = `Request`[``"method"``] |

#### Type declaration

▸ (`request`): `Promise`<`Response`\> \| `Response`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request` |

##### Returns

`Promise`<`Response`\> \| `Response`

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:3](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L3)

___

### WorkerResponse

Ƭ **WorkerResponse**: { `error`: `Error` ; `status`: ``"fail"``  } \| { `status`: ``"ok"``  }

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:18](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L18)
