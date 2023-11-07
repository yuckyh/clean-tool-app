**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / ColumnRequest

# Type alias: ColumnRequest

> **ColumnRequest**: `object` & [`WorkerRequest`](../interfaces/WorkerRequest.md)

The type of the worker's request.

## Example

```ts
const request: ColumnRequest = {
  columns: ['foo', 'foo2'],
  method: 'get',
}
```

## Type declaration

### columns

> **columns**: readonly `string`[]

The columns to search.

### method

> **method**: `"get"`

The worker method.

## Source

[Projects/clean-tool-app/src/workers/column.ts:38](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
