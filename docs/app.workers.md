# Module: app/workers

## Table of contents

### Variables

- [columnWorker](../wiki/app.workers#columnworker)
- [sheetWorker](../wiki/app.workers#sheetworker)

### Functions

- [promisedWorker](../wiki/app.workers#promisedworker)

## Variables

### columnWorker

• `Const` **columnWorker**: [`RequestWorker`](../wiki/types.workers.RequestWorker)<[`ColumnRequest`](../wiki/workers.column.ColumnRequest), [`ColumnResponse`](../wiki/workers.column#columnresponse)\>

#### Defined in

[Projects/clean-tool-app/src/app/workers.ts:10](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/workers.ts#L10)

___

### sheetWorker

• `Const` **sheetWorker**: [`RequestWorker`](../wiki/types.workers.RequestWorker)<[`SheetRequest`](../wiki/workers.sheet#sheetrequest), [`SheetResponse`](../wiki/workers.sheet#sheetresponse)\>

#### Defined in

[Projects/clean-tool-app/src/app/workers.ts:7](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/workers.ts#L7)

## Functions

### promisedWorker

▸ **promisedWorker**<`Req`, `Res`\>(`type`, `worker`, `options?`): `Promise`<`MessageEvent`<`Res`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Req` | extends [`WorkerRequest`](../wiki/types.workers.WorkerRequest) |
| `Res` | extends [`WorkerResponse`](../wiki/types.workers#workerresponse) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"message"`` \| ``"messageerror"`` |
| `worker` | [`RequestWorker`](../wiki/types.workers.RequestWorker)<`Req`, `Res`\> |
| `options` | `AddEventListenerOptions` |

#### Returns

`Promise`<`MessageEvent`<`Res`\>\>

#### Defined in

[Projects/clean-tool-app/src/app/workers.ts:13](https://github.com/yuckyh/clean-tool-app/blob/e8c585b/src/app/workers.ts#L13)
