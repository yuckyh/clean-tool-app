**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / GenericWorkerEventMap

# Interface: GenericWorkerEventMap`<T>`

The event map for the worker events.

## Contents

- [Extends](GenericWorkerEventMap.md#extends)
- [Type parameters](GenericWorkerEventMap.md#type-parameters)
- [Properties](GenericWorkerEventMap.md#properties)
  - [error](GenericWorkerEventMap.md#error)
  - [message](GenericWorkerEventMap.md#message)
  - [messageerror](GenericWorkerEventMap.md#messageerror)

## Extends

- `WorkerEventMap`

## Type parameters

▪ **T**

## Properties

### error

> **error**: `ErrorEvent`

The error event.

#### Overrides

WorkerEventMap.error

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:115](https://github.com/yuckyh/clean-tool-app/)

***

### message

> **message**: `MessageEvent`\<`T`\>

The message event.

#### Overrides

WorkerEventMap.message

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:119](https://github.com/yuckyh/clean-tool-app/)

***

### messageerror

> **messageerror**: `MessageEvent`\<`T`\>

The error message event.

#### Overrides

WorkerEventMap.messageerror

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:123](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
