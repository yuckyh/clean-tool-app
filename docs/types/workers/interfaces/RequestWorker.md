**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / RequestWorker

# Interface: RequestWorker`<Req, Res>`

The extended worker type with typed request and response based on the event type via the [event map](GenericWorkerEventMap.md).

## Contents

- [Extends](RequestWorker.md#extends)
- [Type parameters](RequestWorker.md#type-parameters)
- [Properties](RequestWorker.md#properties)
  - [addEventListener](RequestWorker.md#addeventlistener)
  - [postMessage](RequestWorker.md#postmessage)
  - [removeEventListener](RequestWorker.md#removeeventlistener)

## Extends

- `Worker`

## Type parameters

▪ **Req** extends [`WorkerRequest`](../type-aliases/WorkerRequest.md)

▪ **Res** extends [`WorkerResponse`](../type-aliases/WorkerResponse.md)

## Properties

### addEventListener

> **addEventListener**: \<`K`\>(`type`, `listener`, `options`?) => `void`

#### Type parameters

▪ **K** extends keyof [`GenericWorkerEventMap`](GenericWorkerEventMap.md)\<`Res`\>

#### Parameters

▪ **type**: `K`

▪ **listener**: (`ev`) => `void`

▪ **options?**: `boolean` \| `Readonly`\<`AddEventListenerOptions`\>

#### Returns

`void`

#### Overrides

Worker.addEventListener

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:104](https://github.com/yuckyh/clean-tool-app/)

***

### postMessage

> **postMessage**: (`request`, `options`?) => `void`(`request`, `transfer`) => `void`

#### Parameters

▪ **request**: `Readonly`\<`Req`\>

▪ **options?**: `Readonly`\<`StructuredSerializeOptions`\>

#### Returns

`void`

#### Parameters

▪ **request**: `Readonly`\<`Req`\>

▪ **transfer**: `Transferable`[]

#### Returns

`void`

#### Overrides

Worker.postMessage

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:109](https://github.com/yuckyh/clean-tool-app/)

***

### removeEventListener

> **removeEventListener**: \<`K`\>(`type`, `listener`, `options`?) => `void`

#### Type parameters

▪ **K** extends keyof [`GenericWorkerEventMap`](GenericWorkerEventMap.md)\<`Res`\>

#### Parameters

▪ **type**: `K`

▪ **listener**: (`ev`) => `void`

▪ **options?**: `boolean` \| `Readonly`\<`EventListenerOptions`\>

#### Returns

`void`

#### Overrides

Worker.removeEventListener

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:118](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
