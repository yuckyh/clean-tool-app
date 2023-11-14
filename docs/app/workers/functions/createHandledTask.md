**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/workers](../README.md) / createHandledTask

# Function: createHandledTask()

> **createHandledTask**\<`Request`, `Response`\>(`worker`, `errorMsg`): `Task`\<`Response`\>

## Type parameters

▪ **Request** extends [`WorkerRequest`](../../../types/workers/type-aliases/WorkerRequest.md)\<`string`\>

▪ **Response** extends [`WorkerResponse`](../../../types/workers/type-aliases/WorkerResponse.md)\<`Request`\[`"method"`\], [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md)\>

## Parameters

▪ **worker**: `Readonly`\<[`RequestWorker`](../../../types/workers/interfaces/RequestWorker.md)\<`Request`, `Response`\>\>

▪ **errorMsg**: `string`

## Returns

`Task`\<`Response`\>

## Source

[Projects/clean-tool-app/src/app/workers.ts:25](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
