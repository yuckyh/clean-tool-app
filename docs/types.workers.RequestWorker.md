# Interface: RequestWorker<Req, Res\>

[types/workers](../wiki/types.workers).RequestWorker

## Type parameters

| Name | Type |
| :------ | :------ |
| `Req` | extends [`WorkerRequest`](../wiki/types.workers.WorkerRequest) |
| `Res` | extends [`WorkerResponse`](../wiki/types.workers#workerresponse) |

## Hierarchy

- `Worker`

  ↳ **`RequestWorker`**

## Table of contents

### Properties

- [addEventListener](../wiki/types.workers.RequestWorker#addeventlistener)
- [postMessage](../wiki/types.workers.RequestWorker#postmessage)
- [removeEventListener](../wiki/types.workers.RequestWorker#removeeventlistener)

## Properties

### addEventListener

• **addEventListener**: <K\>(`type`: `K`, `listener`: (`ev`: [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\>[`K`]) => `void`, `options?`: `boolean` \| `Readonly`<`AddEventListenerOptions`\>) => `void`

#### Type declaration

▸ <`K`\>(`type`, `listener`, `options?`): `void`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`ev`: [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\>[`K`]) => `void` |
| `options?` | `boolean` \| `Readonly`<`AddEventListenerOptions`\> |

##### Returns

`void`

#### Overrides

Worker.addEventListener

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:34](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L34)

___

### postMessage

• **postMessage**: (`request`: `Readonly`<`Req`\>, `options?`: `Readonly`<`StructuredSerializeOptions`\>) => `void`(`request`: `Readonly`<`Req`\>, `transfer`: `Transferable`[]) => `void`

#### Type declaration

▸ (`request`, `options?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Readonly`<`Req`\> |
| `options?` | `Readonly`<`StructuredSerializeOptions`\> |

##### Returns

`void`

▸ (`request`, `transfer`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Readonly`<`Req`\> |
| `transfer` | `Transferable`[] |

##### Returns

`void`

#### Overrides

Worker.postMessage

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:39](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L39)

___

### removeEventListener

• **removeEventListener**: <K\>(`type`: `K`, `listener`: (`ev`: [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\>[`K`]) => `void`, `options?`: `boolean` \| `Readonly`<`EventListenerOptions`\>) => `void`

#### Type declaration

▸ <`K`\>(`type`, `listener`, `options?`): `void`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`ev`: [`GenericWorkerEventMap`](../wiki/types.workers.GenericWorkerEventMap)<`Res`\>[`K`]) => `void` |
| `options?` | `boolean` \| `Readonly`<`EventListenerOptions`\> |

##### Returns

`void`

#### Overrides

Worker.removeEventListener

#### Defined in

[Projects/clean-tool-app/src/types/workers.d.ts:47](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/types/workers.d.ts#L47)
