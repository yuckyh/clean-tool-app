**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/utils](../README.md) / promisedWorker

# Function: promisedWorker()

> **promisedWorker**\<`Req`, `Res`\>(`type`, `worker`, `options`): `Promise`\<`MessageEvent`\<`Res`\>\>

## Type parameters

▪ **Req** extends [`WorkerRequest`](../../../types/workers/type-aliases/WorkerRequest.md)\<`string`\>

▪ **Res** extends [`WorkerResponse`](../../../types/workers/type-aliases/WorkerResponse.md)\<`string`, [`ResponseStatus`](../../../types/workers/type-aliases/ResponseStatus.md)\>

## Parameters

▪ **type**: `"message"` \| `"messageerror"`

▪ **worker**: `Readonly`\<[`RequestWorker`](../../../types/workers/interfaces/RequestWorker.md)\<`Req`, `Res`\>\>

▪ **options**: `AddEventListenerOptions`= `undefined`

## Returns

`Promise`\<`MessageEvent`\<`Res`\>\>

## Source

[Projects/clean-tool-app/src/lib/utils.ts:51](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
