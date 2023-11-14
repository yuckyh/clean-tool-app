**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / RequestHandler

# Type alias: RequestHandler`<Request, Response>`

> **RequestHandler**\<`Request`, `Response`\>: (`request`) => `Readonly`\<`Promise`\<`Response`\> \| `Response`\>

## Type parameters

| Parameter |
| :------ |
| `Request` extends [`WorkerRequest`](WorkerRequest.md) |
| `Response` extends [`WorkerResponse`](WorkerResponse.md) |

The handler function that takes in the [request](WorkerRequest.md) and returns the response.

## Parameters

▪ **request**: `Readonly`\<`Request`\>

## Returns

`Readonly`\<`Promise`\<`Response`\> \| `Response`\>

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:95](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
