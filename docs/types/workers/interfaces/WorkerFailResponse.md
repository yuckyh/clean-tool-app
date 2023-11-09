**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / WorkerFailResponse

# Interface: WorkerFailResponse

## Contents

- [Properties](WorkerFailResponse.md#properties)
  - [error](WorkerFailResponse.md#error)
  - [method](WorkerFailResponse.md#method)
  - [status](WorkerFailResponse.md#status)

## Properties

### error

> **error**: `Error`

The error object that signifies a failed response.

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:44](https://github.com/yuckyh/clean-tool-app/)

***

### method

> **method**: `string`

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:45](https://github.com/yuckyh/clean-tool-app/)

***

### status

> **status**: `"fail"`

The status of the response. When the status is `fail`, the response will have an error object.

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
