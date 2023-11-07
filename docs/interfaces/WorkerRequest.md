**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / WorkerRequest

# Interface: WorkerRequest

The base request object that is sent to the worker.

For the sake of consistency, requests have a `method` property.

## Contents

- [Remarks](WorkerRequest.md#remarks)
- [Properties](WorkerRequest.md#properties)
  - [method](WorkerRequest.md#method)

## Remarks

This ensures the worker works like dispatching actions to a reducer.

The word method was used to with reference of the REST API.

## Properties

### method

> **method**: `string`

The method of the request.

#### Source

[Projects/clean-tool-app/src/types/workers.d.ts:20](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
