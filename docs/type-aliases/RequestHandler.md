**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / RequestHandler

# Type alias: RequestHandler`<Request, Response, Method>`

> **RequestHandler**\<`Request`, `Response`, `Method`\>: (`request`) => `Readonly`\<`Promise`\<`Response`\> \| `Response`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Request` extends [`WorkerRequest`](../interfaces/WorkerRequest.md) & `object` | - |
| `Response` extends [`WorkerResponse`](WorkerResponse.md) | - |
| `Method` extends `Request`\[`"method"`\] | `Request`\[`"method"`\] |

## Parameters

▪ **request**: `Readonly`\<`Request`\>

## Returns

`Readonly`\<`Promise`\<`Response`\> \| `Response`\>

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:3](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
