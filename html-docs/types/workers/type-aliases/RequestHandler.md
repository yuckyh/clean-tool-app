**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / RequestHandler

# Type alias: RequestHandler`<Request, Response, Method>`

> **RequestHandler**\<`Request`, `Response`, `Method`\>: (`request`) => `Promise`\<`Response`\> \| `Response`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Request` extends [`WorkerRequest`](../interfaces/WorkerRequest.md) & `object` | - |
| `Response` extends [`WorkerResponse`](WorkerResponse.md) | - |
| `Method` extends `Request`\[`"method"`\] | `Request`\[`"method"`\] |

## Parameters

▪ **request**: `Request`

## Returns

`Promise`\<`Response`\> \| `Response`

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:3](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
