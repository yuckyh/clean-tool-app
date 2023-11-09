**CLEaN Tool - v1.0.0** ( [Readme](../../README.md) \| API )

***

[CLEaN Tool](../../exports.md) / [private](../README.md) / SheetOkResponse

# Interface: SheetOkResponse`<M>`

The response object that is sent back to the main thread.

## Contents

- [Example](SheetOkResponse.md#example)
- [Extends](SheetOkResponse.md#extends)
- [Type parameters](SheetOkResponse.md#type-parameters)
- [Properties](SheetOkResponse.md#properties)
  - [fileName](SheetOkResponse.md#filename)
  - [method](SheetOkResponse.md#method)
  - [status](SheetOkResponse.md#status)
  - [workbook](SheetOkResponse.md#workbook)

## Example

The two possible response types:
```ts
const okResponse: WorkerResponse = {
  status: 'ok',
}

const failResponse: WorkerResponse = {
  error: new Error('foo'),
  status: 'fail',
}
```

## Extends

- [`WorkerResponse`](../../type-aliases/WorkerResponse.md)\<`M`, `"ok"`\>

## Type parameters

▪ **M** extends [`SheetMethod`](../../type-aliases/SheetMethod.md)

## Properties

### fileName

> **fileName**: `string`

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:34](https://github.com/yuckyh/clean-tool-app/)

***

### method

> **method**: `M`

#### Overrides

WorkerResponse.method

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:35](https://github.com/yuckyh/clean-tool-app/)

***

### status

> **status**: `"ok"`

The status of the response. When the status is `ok`, the response will not have an error object.

#### Inherited from

WorkerResponse.status

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:34](https://github.com/yuckyh/clean-tool-app/)

***

### workbook

> **workbook**?: `WorkBook`

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:36](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
