**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / promisedWorker

# Function: promisedWorker()

> **promisedWorker**\<`Req`, `Res`\>(`type`, `worker`, `options`): `Promise`\<`MessageEvent`\<`Res`\>\>

## Type parameters

▪ **Req** extends [`WorkerRequest`](../interfaces/WorkerRequest.md)

▪ **Res** extends [`WorkerResponse`](../type-aliases/WorkerResponse.md)

## Parameters

▪ **type**: `"message"` \| `"messageerror"`

▪ **worker**: [`RequestWorker`](../interfaces/RequestWorker.md)\<`Req`, `Res`\>

▪ **options**: `AddEventListenerOptions`= `undefined`

## Returns

`Promise`\<`MessageEvent`\<`Res`\>\>

## Source

[Projects/clean-tool-app/src/app/workers.ts:13](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
