**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [types/workers](../README.md) / WorkerRequest

# Type alias: WorkerRequest`<Method>`

> **WorkerRequest**\<`Method`\>: `object` & `object`

The base request object that is sent to the worker.

For the sake of consistency, requests have a `method` property.

## Remarks

This ensures the worker works like dispatching actions to a reducer.

The word method was used to with reference of the REST API.

## Type declaration

### method

> **method**: `Method`

## Type declaration

### method

> **method**: `string`

The method of the request.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Method` extends [`RequestMethod`](RequestMethod.md) | `string` |

## Source

[Projects/clean-tool-app/src/types/workers.d.ts:21](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
