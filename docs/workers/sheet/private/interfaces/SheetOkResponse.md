**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [workers/sheet](../../README.md) / [private](../README.md) / SheetOkResponse

# Interface: SheetOkResponse`<M>`

## Contents

- [Extends](SheetOkResponse.md#extends)
- [Type parameters](SheetOkResponse.md#type-parameters)
- [Properties](SheetOkResponse.md#properties)
  - [fileName](SheetOkResponse.md#filename)
  - [method](SheetOkResponse.md#method)
  - [status](SheetOkResponse.md#status)
  - [workbook](SheetOkResponse.md#workbook)

## Extends

- [`WorkerResponse`](../../../../types/workers/type-aliases/WorkerResponse.md)\<`M`, `"ok"`\>

## Type parameters

▪ **M** extends [`SheetMethod`](../../type-aliases/SheetMethod.md)

## Properties

### fileName

> **fileName**: `string`

The name of the file.

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:41](https://github.com/yuckyh/clean-tool-app/)

***

### method

> **method**: `M`

The request method of the sent request for debugging purposes.

#### Overrides

WorkerResponse.method

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:45](https://github.com/yuckyh/clean-tool-app/)

***

### status

> **status**: `"ok"`

The status of the response. When the status is `ok`, the response will not have an error object.

#### Inherited from

WorkerResponse.status

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

### workbook

> **workbook**?: `WorkBook`

The workbook object.

#### Source

[Projects/clean-tool-app/src/workers/sheet.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
