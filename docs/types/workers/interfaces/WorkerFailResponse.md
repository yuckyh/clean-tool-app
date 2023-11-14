**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / WorkerFailResponse

# Interface: WorkerFailResponse

The failed response object.

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

[Projects/clean-tool-app/src/types/workers.d.ts:59](https://github.com/yuckyh/clean-tool-app/)

***

### method

> **method**: `string`

The request method of the sent request for debugging purposes.

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:63](https://github.com/yuckyh/clean-tool-app/)

***

### status

> **status**: `"fail"`

The status of the response. When the status is `fail`, the response will have an error object.

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:67](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
